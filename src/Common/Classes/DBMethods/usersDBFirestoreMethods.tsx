import { UserWithoutId, User } from "../../../Common/interfaces";
import Firebase from '../../../components/Firebase/firebase';

export class UsersDBFirestoreMethods {
    //private static mapUsers: Map<string, string> = new Map();
    //private static lastDateTime: number = 0;
    //private static readonly countSeconds = 60;

    //public static loadUserToMap = (
    //     returnUsers: (map: Map<string, string>) => void
    //) => {
    //    const date = Date.now();
    //    const dif = date - UsersDBFirestoreMethods.lastDateTime;
    //    if (dif < UsersDBFirestoreMethods.countSeconds * 1000) {
    //        returnUsers(UsersDBFirestoreMethods.mapUsers);
    //    } else {
    //        UsersDBFirestoreMethods.loadUsersOnce((users: Array<User>) => {
    //               const mapUsers = new Map<string, string>();
    //                users.forEach((user: User) => {
    //                    mapUsers.set(user.uid, user.username);
    //                });
    //                UsersDBFirestoreMethods.mapUsers = mapUsers;
    //                UsersDBFirestoreMethods.lastDateTime = Date.now();
    //                returnUsers(UsersDBFirestoreMethods.mapUsers);
    //        })
    //    }
    //}

    public static loadUsersOnce = (result: (users: Array<User>) => void) => {
        UsersDBFirestoreMethods
            .users()
            .get()
            .then((query: any) => {
                const users: Array<User> = [];
                query.forEach((doc: any) => {
                    const user: User = doc.data();
                    user.uid = doc.id;
                    users.push(user);
                });
                result(users);
            })
    }

    public static saveUser = (userId: string, user: UserWithoutId) => {
        UsersDBFirestoreMethods.user(userId).set(user);
    }

    public static getUserById = (
        uid: string,
        result: (user: User) => void,
        err: (mes:string) => void,
    ) => {
        UsersDBFirestoreMethods
            .user(uid)
            .get()
            .then((snapshot: any) => {
                 const user: User = {
                    ...snapshot.data(),
                    uid: snapshot.id,
                };
               // console.log('getUserById', user);

                result(user);
            })
            .catch((error: any) => { err(error.message); })
    }

    public static updateUser = (user: User, result: () => void) => {
        UsersDBFirestoreMethods
            .user(user.uid)
            .update({
                address: user.address ?? '',
                username: user.username,
                image: user.image ?? '',
                fullname: user.fullname ?? ''
            })
            .then(() => {
                result();
            });
    }

    public static setInactiveStateofUser = (uid: string, result: () => void) => {
        UsersDBFirestoreMethods
            .user(uid)
            .update({
                roles: { INACTIVE: 'INACTIVE' }
            }).then(() => {
                result();
            })
    }

    public static loadUsersOn = (result: (users: Array<User>) => void): (()=> void) => {
        const unsubscribeLoadUsersOn =
            UsersDBFirestoreMethods
            .users()
            .onSnapshot((query: any) => {
                const users: Array<User> = [];
                query.forEach((doc: any) => {
                    users.push({
                        ...doc.data(),
                        uid: doc.id,
                    })
                });
                result(users);
            });
        return unsubscribeLoadUsersOn;
    }

    public static removeUser = (uid: string) => {
        return UsersDBFirestoreMethods.user(uid).delete();
    }

    private static user = (uid: string) => Firebase.getFirebase().dbFirestore.collection(`users`).doc(uid);
    private static users = () => Firebase.getFirebase().dbFirestore.collection('users');

}