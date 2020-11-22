import React from 'react';
import { AuthUser } from '../../Common/interfaces';
const AuthUserContext = React.createContext<AuthUser | null>(null);
export default AuthUserContext;