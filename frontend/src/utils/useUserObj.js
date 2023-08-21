import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// The default value provided as an argument isn't ever used... Oh well.
const userContext = createContext({
    loaded: false,
    auth: {},
    user: {},
    refresh: () => {}
});

/**
 * Contains the current authenticated user's data when they are authed
 * @typedef UserData
 * @property {boolean} loaded Is true if the user is authed AND their user object has been successfully loaded
 * @property {AuthStatus} auth Auth data related to the user
 * @property {Object} user The user object that corresponds with the authenticated user. Will be an empty object if loaded is false
 * @property {function} refresh Reloads the user data. Returns a promise that resolves once finished (Listening for a change in the user property through useEffect also works)
 */

/**
 * Provider component for the UserData context. Only required to be used once at the root of the app
 * @return {JSX.Element} Returns a provider with UserData as a value
 * @constructor
 */
export function UserObjectContextProvider({ children }) {
    const auth = useAuth();
    const [userData, setUserData] = useState({});

    const updateUserData = () => {
        if(auth.valid) {
            const userEmail = auth.info.email;
            // console.log(`Looking up user object for: ${userEmail}`);
            return fetch(`${SERVER_URL}/user/getbyuser/${userEmail}`)
                .then(res => res.json())
                .then(data => {
                    if(!data || !data[0]) {
                        // TODO: Error handle or redirect
                        console.log("WARNING: Non-existent User");
                        throw new Error("User Not Found");
                    }
                    const newUserData = data[0];
                    // console.log(newUserData);
                    setUserData(newUserData);
                });
        }
        return Promise.resolve();
    };

    useEffect(updateUserData, [auth.info, auth.valid]);

    /**
     * @type {UserData}
     */
    const userContextData = {
        loaded: Boolean(userData._id),
        auth: auth,
        user: userData,
        refresh: updateUserData
    };

    return (
        <userContext.Provider value={userContextData}>
            {children}
        </userContext.Provider>
    );
}

/**
 * User object hook. Contains whether it has been loaded and the user object if loaded
 * Always check things in this relative order (skip steps as needed): auth exists, auth is verified, user is loaded AKA user id exists
 * @returns {UserData} Returns the data about the current user
 */
export default function useUserObj() {
    return useContext(userContext);
}