import React, { useState, useEffect , useRef} from 'react';
import AuthUserContext from './context';
import Firebase from '../Firebase/firebase';
import { AuthUser } from '../../Common/interfaces';

interface WithAuthenticationProps {
}

interface WithAuthenticationState {
	authUser: AuthUser | null;
}

const withAuthentication = (Component1: any) => {
	const WithAuthentication = (props: WithAuthenticationProps) => {
		const [state, setState] = useState<WithAuthenticationState>({
			authUser: JSON.parse(localStorage.getItem('authUser') as string),
		});
		const listener = useRef<any>(null);

		useEffect(() => {
			listener.current = Firebase.getFirebase().onAuthUserListener(
				(authUser) => {
					localStorage.setItem('authUser', JSON.stringify(authUser));
					//if (!state.authUser) {
					//		window.location.reload();
					//}
					const authUserConverted: (AuthUser | null) = authUser as (AuthUser | null);
					setState(prev => ({
						...prev,
						authUser: authUserConverted,
					}));
					//console.log('authUser sign in', authUserConverted);
				},
				() => {
					localStorage.removeItem('authUser');
					setState(prev => ({
						...prev,
						authUser:null }));
				},
			);
			return () => {
				listener.current();
			}
		}, []);

		return (
			<AuthUserContext.Provider value={state.authUser}>
				<Component1 {...props} authUser={state.authUser}/>
			</AuthUserContext.Provider>
		);
	}
	return WithAuthentication;
};
export default withAuthentication;