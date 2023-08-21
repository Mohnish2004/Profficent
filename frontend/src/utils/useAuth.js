import { createContext, useContext, useEffect, useState } from "react";

const BASIC_INFO_KEY = process.env.REACT_APP_BASIC_INFO_KEY || "BASIC_INFO";
const AUTH_COOKIE_STATUS_NAME = process.env.REACT_APP_AUTH_COOKIE_STATUS_NAME || "lunchroom_access_auth_status";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
if(!SERVER_URL) {
    throw new Error("!!! No REACT_APP_SERVER_URL Set. Add it into the .env and restart the app !!!");
}

// The default value provided as an argument isn't ever used... Oh well.
const authContext = createContext({
    status: getAuthStatus(),
    login: () => {
    },
    logout: () => {
    }
});

/**
 * Basic information about the authenticated user. Can also be read from localStorage under the BASIC_INFO_KEY item
 * @typedef BasicInfo
 * @property {string} id Unique user id for api calls
 * @property {string} email Email address
 * @property {string} givenName First name
 * @property {string} familyName Last name
 * @property {string} profile Google profile picture URL. Appears to be size 96x96
 */

/**
 * Contains the current authentication status. Used to determine whether the user is authenticated and includes their basic information
 * @typedef AuthStatus
 * @property {boolean} valid Whether the stored authentication data is valid AND basicInfo is loaded
 * @property {boolean} nonexpired False when the stored authentication data is expired/nonexistent (Does not differentiate)
 * @property {boolean} exists False when the stored authentication data is nonexistent
 * @property {string} status A string representation of the authentication status. Use it for console.log() when debugging
 * @property {BasicInfo|null} info Basic info about the authenticated user. Is fetched from server or localStorage and is null if not logged in
 */

/**
 * @typedef AuthManager
 * @property {AuthStatus} status Authentication status from cookies
 * @property {function} login Requests a Google Auth Login URL and forces a redirect.
 * @property {function} logout Requests authentication data deletions and clears localStorage and cookies. Forces a refresh (The forced refresh is an optional design choice. Use function sparingly)
 */

/**
 * Object used to store a more human-readable version of the server's response to a validation request
 * @typedef ValidationStatus
 * @property {Error} [err] An error object from the fetch() API if found
 * @property {boolean} responded Whether the server responded to the request for validation
 * @property {boolean} validated Whether the server recognized the authentication data as valid
 * @property {string} message String that describes the status. Intended for logging and debugging, not for conditionals
 * @property {Response} res The response from the fetch() API if found
 */

/**
 * Clears the authentication data from cookies with a DELETE request to the server.
 * On success, both the status and the authentication data will be deleted
 * On fail, the status will be set to OUTDATED but the authentication data will still technically be valid
 * Fails are self-caught with no-ops. Attempt to delete again as soon as possible as the authentication data will still be valid until its expiration date
 * @returns {Promise} Resolves once deletion is successful
 */
function deleteToken() {
    // Forces expiration of cookie below (Doesn't actually delete auth unless request is successful)
    document.cookie = `${AUTH_COOKIE_STATUS_NAME}=0`;
    localStorage.removeItem(BASIC_INFO_KEY);
    return fetch(`${SERVER_URL}/auth/delete`, {
        method: "DELETE",
        credentials: "include"
    }).catch(() => {
    });
}

/**
 * Loads authentication data status from cookies and localStorage
 * No verification is performed
 * @return {AuthStatus} Locally stored authentication data and status if found.
 */
export function getAuthStatus() {
    const authStatus = (document.cookie.split(";")
        .find(cookieName => cookieName.trim().startsWith(`${AUTH_COOKIE_STATUS_NAME}=`)) || "=")
        .split("=")[1];
    const basicInfo = JSON.parse(localStorage.getItem(BASIC_INFO_KEY) || null);

    const status = {
        nonexpired: Boolean(authStatus) ? Number(authStatus) > Date.now() : false,
        exists: Boolean(authStatus),
        valid: false,
        status: "Uh oh, you shouldn't be seeing this",
        info: basicInfo
    };
    status.valid = Boolean(status.nonexpired && basicInfo);
    status.status = !status.nonexpired ? "Expired/Nonexistent" : status.valid ? "Good" : "Invalid";

    return status;
}

/**
 * Checks to see if the current authentication data is valid and deletes auth data if not valid
 * @throws {ValidationStatus} Throws validation status with an err property if fetch() fails or is unable to reach the server
 * @return {Promise<ValidationStatus>} Access the original fetch response with the res key. return value has additional properties responded, validated, and message
 */
function checkAuth() {

    /** @type ValidationStatus */
    const status = {
        responded: false,
        validated: false,
        message: "Server did not respond",
        res: {},
        err: null
    };

    return fetch(`${SERVER_URL}/auth/verify`, {
        method: "GET",
        credentials: "include"
    }).catch(err => {
        status.message = `Unable to Reach Server: ${err.message}`;
        status.err = err;
        throw status;
    }).then(res => {
        status.responded = true;
        status.res = res;
        if(res.status === 200) {
            status.validated = true;
            status.message = "Valid Token";
            return status;
        }
        status.message = `Invalid Token [${res.status}]`;
        return deleteToken().then(() => status);
    });
}

/**
 * Provider component for the AuthManager context. Only required to be used once at the root of the app
 * Schedules an auth status update every 10 minutes
 * @return {JSX.Element} Returns a provider with AuthManager as a value
 * @constructor
 */
export function TokenContextProvider({ children }) {
    const [status, setTokenState] = useState(getAuthStatus());

    useEffect(() => {
        let isUnmounted = false;

        // Fire and forget function that should take care of the status state
        const validationFlow = () => {
            // Only fires checkAuth when an auth token likely exists (Does not fire not logged in)
            if(!status.nonexpired) {
                return;
            }

            checkAuth().then(status => {
                // TODO: Handle other cases
                if(status.validated) {
                    status.res.json().then(basicInfo => {
                        if(isUnmounted) {
                            return;
                        }

                        // Lightly diffing the two states to prevent unnecessary rerenders
                        if(status.email === basicInfo.email) {
                            return;
                        }

                        localStorage.setItem(BASIC_INFO_KEY, JSON.stringify(basicInfo));
                        setTokenState(getAuthStatus());
                    });
                } else if(status.responded) {
                    setTokenState(getAuthStatus());
                }
            }).catch(err => {
                console.log("Unable to reach server. This error does nothing in Development but should do something in production:");
                console.log(err);
            });
        };

        // Call once immediately before scheduling updates
        validationFlow();
        const interval = setInterval(validationFlow, 10 * 60 * 1000); // 10 minute intervals
        return () => {
            // Note: An unmount should normally never occur but this is here just in case (and its good practice)
            isUnmounted = true;
            clearInterval(interval);
        };
    }, [status.nonexpired]);

    /**
     * @type {AuthManager}
     */
    const authData = {
        status,
        login: () => {
            // Note: Lazy redirect being used. Change to fetch request if taking care of when the server is down matters
            window.location = `${SERVER_URL}/auth/redirect`;
        },
        logout: () => {
            deleteToken().then(() => {
                setTokenState(getAuthStatus());
                // Note: This redirect is not required for the app to function properly
                window.location = "/";
            });
        }
    };

    return (
        <authContext.Provider value={authData}>
            {children}
        </authContext.Provider>
    );
}

/**
 * Authentication hook. Returns the basic information in the status property or methods to change the authentication status
 * @param {boolean} [readOnly=true] Determines whether to return all the methods to change the authentication status too. Warning: Methods that change the status should be used sparingly as they will rerender pretty much the entire app
 * @returns {AuthStatus|AuthManager} Returns only the stored authentication status. Unless readOnly is set to false, in which case, all the methods to change the status will be returned with it instead
 */
export default function useAuth(readOnly = true) {
    const contextVal = useContext(authContext);
    return readOnly ? contextVal.status : contextVal;
}