/**
 * Component that forces authentication to be used before accessing contents
 * Displays a spinner while loading auth data and redirects if no auth data is found
 */
import useAuth from "../../utils/useAuth";
import useUserObj from "../../utils/useUserObj";
import FloatingCard from "./FloatingCard";
import LockIcon from "../../images/icons/lock.svg";
import "../../css/forceAuth.css";

/**
 * Shows one of three screens: Authenticating loader, Unauthorized page, or the intended component
 * @param {Object} props
 * @param {JSX.Element} props.children Component to render if authorized
 * @returns {JSX.Element}
 * @constructor
 */
function ForceAuth({ children }) {
    const { login } = useAuth(false);
    const userObj = useUserObj();

    if(userObj.loaded) {
        return children;
    }

    let contents =
        <FloatingCard
            title="Invalid Login"
            description="Your login is invalid or expired"
            imageSrc={LockIcon}
            onClick={login}
            spinner={false}
        />
    ;

    let showInvalid = false;
    if(userObj.auth.valid) {
        // console.log("LOGGING IN");
        contents =
            <FloatingCard
                title="Logging In"
                description="If you see this for more than 5 seconds, you might not be logged in!"
                onClick={login}
                spinner={true}
            />
        ;

        if(!userObj.loaded) {
            // console.log("LOCATING PROFILE");
            contents =
                <FloatingCard
                    title="Loading Profile"
                    description="Give us a second to load your profile..."
                    onClick={login}
                    spinner={true}
                />
            ;
        }
    } else {
        showInvalid = true;
        // console.log("DEFAULT (INVALID)");
    }

    return (
        <div className={`forceAuthContainer ${showInvalid ? "blurContainer" : ""}`}>
            {contents}
        </div>
    );
}

export default ForceAuth;