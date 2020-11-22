import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation/navigation';
import LandingPage from '../Landing/landing';
import SignUpPage, { CorrectAccountPage } from '../Account/SignUp';
import SignInPage from '../Account/SignIn';
import PasswordForgetPage from '../Account/PasswordForgetForm';
import UserProfilePage from '../Account/UserProfile';
import AdminPage from '../Admin/admin';
import AddNewTrailPage from '../Trails/AddTrailPage/addTrailPage';
import TrailDetailsPage from '../Trails/TrailDetailsPage/trailDetailsPage';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import RolesPage from '../Roles/roles';
import ContactsPage from '../Contacts/contacts';
import MyThoughtsPage from '../MyThoughts/myThoughts';
import IsMyTrailsOnlyContext from './isMyTrailsOnlyContext';
import TrailsReportPage from '../Trails/TrailsReportPage/trailsReportPage';
import { DBMethods } from '../../Common/Classes/DBMethods/DBMethods';
import './app.css';

const App = () => {

    const [trailFlags, setTrailFlags] = useState({
        isMyTrails: false,
        isMyRunningTrails: true,
      //  wasChanged: false,
    });

    const unsubscribe = useRef(null);

    useEffect(() => {
           // DBMethods.moveAllUsersToFirestore();
        unsubscribe.current = DBMethods.loadUsersOn(DBMethods.loadMap);
        return  () => {
            console.log('app end');
            if (unsubscribe.current) {
                unsubscribe.current()
            } else {
                DBMethods.loadUsersOff();
            }
        }
    }
    , []);

    const changeTrailsFlag = (flags) => {
        setTrailFlags(flags);
    }

    const tr = { ...trailFlags };
   
     return (
         <Router>
             <div className="app">
                 <Navigation
                     changeTrailsFlag={changeTrailsFlag}
                     trailFlags={tr}
                 />
                 <IsMyTrailsOnlyContext.Provider value={trailFlags}>
                    <div className="app_container">
                        <Route exact path={ROUTES.LANDING} component={LandingPage} />
                        <Route exact path={ROUTES.TRAILS} component={LandingPage} />
                        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                        <Route path={ROUTES.CORRECT_ACCOUNT} component={CorrectAccountPage} />
                        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                        <Route
                            path={ROUTES.PASSWORD_FORGET}
                            component={PasswordForgetPage}
                        />
                        <Route path={ROUTES.ADMIN} component={AdminPage} />
                        <Route path={ROUTES.ADD_TRAIL} component={AddNewTrailPage} />
                        <Route path={ROUTES.TRAIL_DETAILS} component={TrailDetailsPage} />
                        <Route path={ROUTES.ROLES} component={RolesPage} />
                        <Route path={ROUTES.CONTACTS} component={ContactsPage} />
                         <Route path={ROUTES.PROFILE} component={UserProfilePage} />
                         <Route path={ROUTES.THOUGHTS} component={MyThoughtsPage} />
                         <Route path={ROUTES.TRAIL_REPORT} component={TrailsReportPage} />
                    </div>
                </IsMyTrailsOnlyContext.Provider>
                <div className="footer"> </div>
            </div>
        </Router>
    );
    //return (
    //   < input type = 'number' min = { 2} max = { 7} defaultValue = { 2} />

    //)
}
export default withAuthentication(App);
