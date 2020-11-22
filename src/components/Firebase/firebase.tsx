import firebase from 'firebase';
import app from 'firebase/app';
import { firebaseConfig, EMAIL_CONFIRMATION_REDIRECT_URL } from './config'
import 'firebase/auth';
import 'firebase/database';
import { User } from '../../Common/interfaces';
import { DBMethods } from '../../Common/Classes/DBMethods/DBMethods';

class Firebase {
    private constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.database();
        this.dbFirestore = app.firestore();
       // this.storageRef = app.storage().ref();
       // this.storageRef = firebase.storage().ref();
        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.facebookProvider = new app.auth.FacebookAuthProvider();
        this.serverValue = app.database.ServerValue;
        this.serverValueFirestoreTimestamp = firebase.firestore.Timestamp;
        //this.addMockRestaurants();
    }
    private auth: firebase.auth.Auth;
    public  db: firebase.database.Database;
    public dbFirestore: firebase.firestore.Firestore;
    //private storageRef: firebase.storage.Reference;
    private googleProvider: app.auth.FacebookAuthProvider;
    private facebookProvider: app.auth.FacebookAuthProvider;
    private static firebaseImpl: Firebase | null = null;

    public serverValue: any;
    public serverValueFirestoreTimestamp: any;

    public static getFirebase = (): Firebase => {
        if (!Firebase.firebaseImpl) {
            Firebase.firebaseImpl = new Firebase();
        }
        return Firebase.firebaseImpl;
    }    
 
    public doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password);
    public doSignInWithEmailAndPassword = (email:string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password);
    public doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider);
    public doSignInWithFacebook = () =>
        this.auth.signInWithPopup(this.facebookProvider);
    public doSignOut = () => this.auth.signOut();
    public doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);
    public doPasswordUpdate = (password:string) =>
        this.auth.currentUser?.updatePassword(password);
    public doReauthenticate = (password: string) => {
        const user = this.auth.currentUser;
        if (user && user.email) {
            const cred = app.auth.EmailAuthProvider.credential(user.email, password);
            return user.reauthenticateWithCredential(cred);
        }
        return null;
    }
    public doSendEmailVerification = () =>
        this.auth.currentUser?.sendEmailVerification({
            url: EMAIL_CONFIRMATION_REDIRECT_URL
        });
    public doDeleteAuthUser = () => {
        this.auth.currentUser?.delete(); 
    }

    // *** Merge Auth and DB User API *** //
    public onAuthUserListener = (next: (arg: User) => void, fallback: () => void) =>
        this.auth.onAuthStateChanged((authUser: any) => {
            if (authUser) {
                const result = (user: User) => {
                   // console.log('authUser change user', user);
                    authUser = {
                        ...user,
                        uid: authUser?.uid,
                        email: authUser?.email,
                        emailVerified: authUser?.emailVerified,
                        providerData: authUser?.providerData,
                    };
                    console.log('authUser change', authUser);
                    next(authUser);
                };
                DBMethods.getUserById(authUser.uid, result, (err: string) => { });
            } else {
                fallback();
            }
        });


    // *** Images API ***

    private getStoragrRef = (): firebase.storage.Reference => app.storage().ref();
    public image = (folder: string, name: string) => this.getStoragrRef().child(`images/${folder}/${name}`);
    public trailImages = (folder: string) => this.getStoragrRef().child(`images/${folder}`);



}
export default Firebase;
