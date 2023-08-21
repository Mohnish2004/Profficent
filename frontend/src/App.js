import "bootstrap/dist/css/bootstrap.min.css";
import "sf-font/stylesheet.css";
import "./css/index.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserObjectContextProvider } from "./utils/useUserObj";
import { TokenContextProvider } from "./utils/useAuth";
import ForceAuth from "./components/Misc/ForceAuth";
import Home from "./pages/Home";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import Review from "./pages/Review";
import WriteReview from "./pages/WriteReview";
import Error404 from "./pages/Error404";

import Navbar from "./components/NavBar/index";

// Unused. Profile page used to set details instead of onboarding page
// import NewAccount from "./components/old/NewAccount";

function App() {
    return (
        <div className="App">
            <TokenContextProvider>
                <UserObjectContextProvider>
                    <Navbar />
                    <Router>
                        <Switch>
                            <Route exact path="/"> <Home/> </Route>
                            <Route exact path="/faq"> <FAQ/> </Route>
                            <Route exact path="/review/:id"> <Review/> </Route>
                            <Route exact path="/review/write/:id"> <ForceAuth> <WriteReview/> </ForceAuth> </Route>
                            <Route exact path={["/profile", "/login"]}> <ForceAuth> <Profile/> </ForceAuth> </Route>
                            {/* <Route path="/new"> <ForceAuth> <NewAccount/> </ForceAuth> </Route>*/}
                            <Route path="*"> <Error404/> </Route>
                        </Switch>
                    </Router>
                </UserObjectContextProvider>
            </TokenContextProvider>
        </div>
    );
}

export default App;