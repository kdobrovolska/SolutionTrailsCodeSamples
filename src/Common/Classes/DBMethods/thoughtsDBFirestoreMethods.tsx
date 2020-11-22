import Firebase from '../../../components/Firebase/firebase';
import {UserThoughtsData} from "../../../Common/interfaces";

export class ThoughtsDBFirestoreMethods {

    public static getThoughtsOnce = (
        uid: string,
        result: (val: UserThoughtsData) => void,
        error: () => void,
    ) => {
        ThoughtsDBFirestoreMethods.thoughtsOfUser(uid)
            .get()
            .then((snapshot: any) => {
                const val: UserThoughtsData = snapshot.data();
                if (val) {
                    result(val);
                }
            })
            .catch(() => { error() })
    }

    public static setThougths = (uid: string, data: UserThoughtsData) => {
        ThoughtsDBFirestoreMethods.thoughtsOfUser(uid).set(data);
    }

    private static thoughtsOfUser = (uid: string) => {
        return Firebase.getFirebase().dbFirestore.collection(`thoughtsOfUsers`).doc(uid);
    }
    private static thoughtsOfUsers = () => {
        return Firebase.getFirebase().dbFirestore.collection(`thoughtsOfUsers`);
    }


}