/**
 * All endpoints for Google Auth 2.0
 */
const router = require("express").Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { verify, sign } = require("../jwtManager");
const addUser = require("../utils/addUser");
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "lunchroom_access_auth";
const AUTH_COOKIE_STATUS_NAME = process.env.AUTH_COOKIE_STATUS_NAME || "lunchroom_access_auth_status";
const AUTH_AGE_MS = 1000 * 60 * 60 * 24; // Full day (24hrs)
const COOKIE_OPTIONS = {
    httpOnly: true,
    // secure: true, // TODO: Check if required
    // signed: true // TODO: Exists. Check if required
};

const authClient = new OAuth2Client(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECRET,
    process.env.GOOGLE_AUTH_REDIRECT_URI
);

/**
 * Attaches the cookies to the Express response object
 * @param {Response} res Express response object
 * @param {string|Object} token Auth token to set as httpOnly cookie
 * @param {string} status Authentication status
 * @returns {Response} Returns the same response object now with cookies. Response#send() has not been called
 */
function attachCookies(res, token, status) {
    return res.cookie(AUTH_COOKIE_NAME, token, Object.assign({
        maxAge: AUTH_AGE_MS
    }, COOKIE_OPTIONS)).cookie(AUTH_COOKIE_STATUS_NAME, status, {
        maxAge: AUTH_AGE_MS
    });
}

/**
 * Adds headers to delete cookies to the Express response object
 * @param {Response} res Express response object
 * @returns {Response} Returns the same response object now with expired cookies. Response#send() has not been called
 */
function deleteCookies(res) {
    return res
        .clearCookie(AUTH_COOKIE_NAME, COOKIE_OPTIONS)
        .clearCookie(AUTH_COOKIE_STATUS_NAME);
}

/**
 * GET request that creates and redirects to a Google Auth URL
 */
router.get("/redirect", (req, res) => {
    res.redirect(authClient.generateAuthUrl({
        access_type: "offline",
        scope: ["email", "profile", "openid"],
        prompt: "consent"
    }));
});

/**
 * GET request that verifies an access token cookie
 * Returns basic information as JSON
 */
router.get("/verify", (req, res) => {
    const authCookieJWT = req.cookies[AUTH_COOKIE_NAME];
    if(!authCookieJWT) {
        return res.status(401).send("No Authentication Cookie Found");
    }

    verify(authCookieJWT)
        .then(status => {
            if(!status.valid) {
                return res.status(401).send(status.message);
            }
            res.json(status.token);
        })
        .catch(err => {
            console.log("Unable to verify JWT:");
            console.log(err);
            return res.status(401).send(`Unable to verify JWT: ${err}`);
        });
});

/**
 * GET request that receives the Google Auth Code
 */
router.get("/", (req, res) => {
    const code = req.query.code;
    if(!code) {
        console.log("Alert: Response to /auth received without actual data");
        return res.redirect("/auth/redirect");
    }

    authClient.getToken(code).then(({ tokens }) => {
        const decodedJWT = jwt.decode(tokens.id_token);
        const expiration = Date.now() + AUTH_AGE_MS;

        const signed = sign({
            email: decodedJWT.email,
            picture: decodedJWT.picture,
            givenName: decodedJWT.given_name,
            familyName: decodedJWT.family_name,
            expiration: expiration
        });

        addUser({
            email: decodedJWT.email,
            name: {
                firstName: decodedJWT.given_name,
                lastName: decodedJWT.family_name,
            },
            password: "No password"
        }).then(() => {
            // attachCookies(res, signed, expiration.toString()).redirect(`${process.env.CLIENT_URL}/login`);
            attachCookies(res, signed, expiration.toString()).redirect(`${process.env.CLIENT_URL}/profile`);
        });
    }).catch(err => {
        console.log("Unable to exchange for user data:");
        console.log(err);
        res.redirect("/auth/redirect");
        // res.send(`Unable to use code: ${err}`);
    });
});

/**
 * DELETE request that deletes an access token cookie
 * Depending on the browser, the cookie might still "exist" but the cookie should be invalid
 */
router.delete("/delete", (req, res) => {
    deleteCookies(res).send("Deleting Cookies");
});

/**
 * Express Router instance containing all /auth routes
 */
module.exports = router;