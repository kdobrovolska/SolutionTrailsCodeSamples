import { UserWithoutId, User } from "../../../Common/interfaces";
import Firebase from '../../../components/Firebase/firebase';

export class UsersDBMethods {
    //private static mapUsers: Map<string, string> = new Map();
    //private static lastDateTime: number = 0;
    //private static readonly countSeconds = 60;

    //public static loadUserToMap = (
    //     returnUsers: (map: Map<string, string>) => void
    //) => {
    //    const date = Date.now();
    //    const dif = date - UsersDBMethods.lastDateTime;
    //    if (dif < UsersDBMethods.countSeconds * 1000) {
    //        returnUsers(UsersDBMethods.mapUsers);
    //    } else {
    //        UsersDBMethods.loadUsersOnce((users: Array<User>) => {
    //            const mapUsers = new Map<string, string>();
    //            users.forEach((user) => {
    //                mapUsers.set(user.uid, user.username);
    //            });
    //            UsersDBMethods.mapUsers = mapUsers;
    //            UsersDBMethods.lastDateTime = Date.now();
    //            returnUsers(UsersDBMethods.mapUsers);
    //        })
    //    }
    //}

    public static loadUsersOnce = (result: (users:Array<User>) => void) => {
        UsersDBMethods
            .users()
            .once('value')
            .then((snapshot: any) => {
                const usersObject = snapshot.val();
                const users: Array<User> = [];
                Object.keys(usersObject).forEach((key) => {
                    const user: User = {
                        ...usersObject[key],
                        uid: key,
                    }
                    users.push(user);
                 });
                result(users);
            })
    }

    public static saveUser = (userId: string, user: UserWithoutId) => {
        UsersDBMethods.user(userId).set(user);
    }

    public static getUserById = (
        uid: string,
        result: (user: User) => void,
        err: (mes:string) => void,
    ) => {
        UsersDBMethods
            .user(uid)
            .once('value')
            .then((snapshot: any) => {
                const user: User = {
                    ...snapshot.val(),
                    uid: snapshot.key,
                };
                result(user);
            })
            .catch((error: any) => err(error.message));
    }

    public static updateUser = (user: User, result: () => void) => {
        UsersDBMethods
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
        UsersDBMethods
            .user(uid)
            .update({
                roles: { INACTIVE: 'INACTIVE' }
            }).then(() => {
                result();
            })
    }

    public static loadUsersOn = (result: (users: Array<User>) => void): any => {
        UsersDBMethods.users().on('value', (snapshot: any) => {
            const usersObject = snapshot.val();
            const usersList: Array<User> = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            result(usersList);
        });
        return null;
    }

    public static loadUsersOff = () => {
        UsersDBMethods.users().off();
    }

    public static removeUser = (uid: string) => {
        return UsersDBMethods.user(uid).remove();
    }

    private static user = (uid: string) => Firebase.getFirebase().db.ref(`users/${uid}`);
    private static  users = () => Firebase.getFirebase().db.ref('users');
   
}