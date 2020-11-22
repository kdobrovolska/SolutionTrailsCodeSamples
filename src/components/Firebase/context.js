import React from 'react';

const create1 = () => {
    return React.createContext(null)
}

const FirebaseContext = create1();


export const withFirebase = Component1 => props => {
    return (
        <FirebaseContext.Consumer>
            {firebase => <Component1 {...props} firebase={firebase} />}
        </FirebaseContext.Consumer>
    );
};

export default FirebaseContext;