import Firebase from '../../../components/Firebase/firebase';
import {UserThoughtsData} from "../../../Common/interfaces";

export class ThoughtsDBMethods {
 
    public static getThoughtsOnce = (
        uid: string,
        result: (val: UserThoughtsData) => void,
        error: () => void,
    ) => {
        ThoughtsDBMethods.thoughtsOfUser(uid).once('value')
            .then((snapshot: any) => {
                const val: UserThoughtsData = snapshot.val();
                if (val) {
                    result(val);
                }
            })
            .catch(() => {error() })
    }

    public static setThougths = (uid: string, data: UserThoughtsData) => {
        ThoughtsDBMethods.thoughtsOfUser(uid).set(data);
    }

    private static thoughtsOfUser = (uid: string) => {
        return Firebase.getFirebase().db.ref(`thoughtsOfUsers/${uid}`);
    }
    private static thoughtsOfUsers = () => {
        return Firebase.getFirebase().db.ref('thoughtsOfUsers');
    }

    
}