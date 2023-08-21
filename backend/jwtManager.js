const jwt = require("jsonwebtoken");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "No Key";
if(JWT_PRIVATE_KEY === "No Key") {
    console.warn("No JWT_PRIVATE_KEY was set! Insecure tokens being used (Fine for testing)");
}

function verify(unverifiedJWT) {
    const result = {
        valid: false,
        expired: false,
        message: "Unknown Error",
        token: null
    };

    return new Promise((resolve, reject) => {
        jwt.verify(unverifiedJWT, JWT_PRIVATE_KEY, (err, decodedJWT) => {
            if(err) {
                reject(err);
            }

            if(decodedJWT.expiration < Date.now()) {
                console.log("Expired Token Detected");
                result.expired = true;
                result.message = "Outdated Token Used";
                resolve(result);
            }

            // console.log("Verified!");
            // console.log(decodedJWT);
            result.valid = true;
            result.token = decodedJWT;
            resolve(result);
        });
    });
}

function sign(payload) {
    return jwt.sign(payload, JWT_PRIVATE_KEY);
}

module.exports = {
    verify,
    // Just another name for verify
    decode: verify,
    sign
};