import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import AuthUserContext from './context';
import * as ROUTES from '../../constants/routes';
import Firebase from '../Firebase/firebase';

interface WithAuthorizationProps extends RouteComponentProps {

}

const withAuthorization = (condition: (authUser: any) => boolean)  => (Component: typeof React.Component) => {
    class WithAuthorization extends React.Component<WithAuthorizationProps> {
        private listener: any;
        componentDidMount() {
            this.listener = Firebase.getFirebase().onAuthUserListener(
                (authUser:any) => {
                    if (!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
                () => this.props.history.push(ROUTES.SIGN_IN),
            );
        }
     
        componentWillUnmount() {
            this.listener();
        }

         render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser => {
                        return condition(authUser) ? <Component {...this.props} authUser={authUser}/> : null}
                    }
                </AuthUserContext.Consumer>
            );
        }
    }
    return  withRouter(WithAuthorization);
};
export default withAuthorization;

