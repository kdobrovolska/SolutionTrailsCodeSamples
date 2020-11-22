import {
    TrailInterfaceEx, LogData, StatisticLogData, StatisticLogDataWithUserNames,
    User, UserWithoutId, BaseTrailInterface, StepData, UserThoughtsData
} from "../../interfaces";

import { LogsDBFirestoreMethods } from './logsDBFirestoreMethods';
import { LogsDBMethods } from './logsDBMethods';
import { TrailDBFirestoreMethods } from './trailDBFirestoreMethods';
import { TrailDBMethods } from './trailDBMethods';
import { UsersDBFirestoreMethods } from './usersDBFirestoreMethods';
import { UsersDBMethods } from './usersDBMethods';
import { ThoughtsDBFirestoreMethods } from './thoughtsDBFirestoreMethods';
import { ThoughtsDBMethods } from './thoughtsDBMethods';
import Firebase from '../../../components/Firebase/firebase';

export class DBMethods {
    private static isFirestore = true;
    public static mapUserIdToUserName: Map<string, string> = new Map();

    public static execOperationLogsForTrail = (
        fieldName: string,
        fieldValue: string,
        operationTrailLogDataList?: (logs: Array<LogData>) => void,
        operationTrailLogDataKeyList?: (keys: Array<string>) => void,
    ) => {
        return DBMethods.isFirestore
            ? LogsDBFirestoreMethods.execOperationLogsForTrail(
                fieldName,
                fieldValue,
                operationTrailLogDataList,
                operationTrailLogDataKeyList)
            : LogsDBMethods.execOperationLogsForTrail(
                fieldName,
                fieldValue,
                operationTrailLogDataList,
                operationTrailLogDataKeyList)
    }

    public static readStatisticLogAll = (
        returnStatusticLogDataList: (logs: Array<StatisticLogDataWithUserNames>) => void,
    ) => {
        return DBMethods.isFirestore
            ? LogsDBFirestoreMethods.readStatisticLogAll(returnStatusticLogDataList)
            : LogsDBMethods.readStatisticLogAll(returnStatusticLogDataList);
    }

    public static loadStatisticLogsOn = (
        userId: string,
        beforeDataSent: () => void,
        result: (logData: StatisticLogData) => void,
    ) => {
        return DBMethods.isFirestore
            ? LogsDBFirestoreMethods.loadStatisticLogsOn(userId,beforeDataSent, result)
            : LogsDBMethods.loadStatisticLogsOn(userId, beforeDataSent, result);

    }

    public static loadStatisticsOff = () => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.loadStatisticsOff();
        } else {
            LogsDBMethods.loadStatisticsOff();
        }
    }

    public static readStatisticLogOn = (
        beforeDataSent: (() => void),
        returnStatusticLogDataList: (log: StatisticLogDataWithUserNames) => void,
    ) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.readStatisticLogOn(beforeDataSent, returnStatusticLogDataList);
        } else {
            LogsDBMethods.readStatisticLogOn(beforeDataSent, returnStatusticLogDataList);
        }
    }

    public static readStatisticLogOff = () => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.readStatisticLogOff();
        } else {
            LogsDBMethods.readStatisticLogOff();
        }
    }

    public static removeLogsForTrailUser = (
        userId: string,
        trailId: string,
        afterAswersRemoved?: () => void,

    ) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.removeLogsForTrailUser(userId, trailId, afterAswersRemoved);
        } else {
            LogsDBMethods.removeLogsForTrailUser(userId, trailId, afterAswersRemoved);
        }
    }

    public static removeLogsForTrail = (
        trailId: string,
        afterAswersRemoved?: () => void,
    ) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.removeLogsForTrail(trailId, afterAswersRemoved);
        } else {
            LogsDBMethods.removeLogsForTrail(trailId, afterAswersRemoved);
        }
    }

    public static removeStatlisticsLogForTrailUser = (
        userId: string,
        trailId: string,
    ) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.removeStatlisticsLogForTrailUser(userId, trailId);
        } else {
            LogsDBMethods.removeStatlisticsLogForTrailUser(userId, trailId);
        }
    }

    public static removeStatlisticsLogForTrail = (
        trailId: string,
    ) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.removeStatlisticsLogForTrail(trailId);
        } else {
            LogsDBMethods.removeStatlisticsLogForTrail(trailId);
        }
    }

    public static saveLogData = (id: string, log: LogData) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.saveLogData(id, log);
        } else {
            LogsDBMethods.saveLogData(id, log);
        }
    }

    public static saveStatisticLogData = (id: string, statLog: StatisticLogData) => {
        if (DBMethods.isFirestore) {
            LogsDBFirestoreMethods.saveStatisticLogData(id, statLog);
        } else {
            LogsDBMethods.saveStatisticLogData(id, statLog);
        }
    }

    //-----------------------trails-----------------------

    public static loadTrailsOn = (
        authUser: User | undefined | null,
        beforeTrailsSent: () => void,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void
    ) => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.loadTrailsOn(authUser, beforeTrailsSent, addTrail);
        } else {
            TrailDBMethods.loadTrailsOn(authUser, beforeTrailsSent, addTrail);
        }
    }

    public static loadTrailsOff = () => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.loadTrailsOff();
        } else {
            TrailDBMethods.loadTrailsOff();
        }
    }

    public static loadTrail = (
        uidTrail: string,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void,
        isMyRunningTrails: boolean,
    ) => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.loadTrail(uidTrail, addTrail, isMyRunningTrails);
        } else {
            TrailDBMethods.loadTrail(uidTrail, addTrail, isMyRunningTrails);
        }
    }

    public static loadStepsTrail = (
        uidTrail: string,
        addSteps: (stepsStringified: string) => void
    ) => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.loadStepsTrail(uidTrail, addSteps);
        } else {
            TrailDBMethods.loadStepsTrail(uidTrail, addSteps);
        }
    }

    public static makeUserTrailsInActive = (
        userId: string,
        operationFinished?: () => void
    ) => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.makeUserTrailsInActive(userId, operationFinished);
        } else {
            TrailDBMethods.makeUserTrailsInActive(userId, operationFinished);
        }
    }

    public static removeTrail = (
        uidTrail: string,
        finishRemove: () => void,
        errorRemove: () => void
    ) => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.removeTrail(uidTrail, finishRemove, errorRemove);
        } else {
            TrailDBMethods.removeTrail(uidTrail, finishRemove, errorRemove);
        }
    }

    public static saveTrail = (
        trail: BaseTrailInterface,
        uidTrailCurrent: string,
        authUserUid: string,
        imageFile: File | null | undefined,
        steps: StepData[],
        setTrailBaseInState: (trailBase: BaseTrailInterface) => void,
        setUidTrailInState: (uidTrail: string) => void,
    ) => {
        if (DBMethods.isFirestore) {
            TrailDBFirestoreMethods.saveTrail(
                trail,
                uidTrailCurrent,
                authUserUid,
                imageFile,
                steps,
                setTrailBaseInState,
                setUidTrailInState);
        } else {
            TrailDBMethods.saveTrail(
                trail,
                uidTrailCurrent,
                authUserUid,
                imageFile,
                steps,
                setTrailBaseInState,
                setUidTrailInState,
            );
        }
    }
    ///-----------------------------users--------------------

    public static loadUsersOnce = (
        result: (users: Array<User>) => void
    ) => {
        if (DBMethods.isFirestore) {
            UsersDBFirestoreMethods.loadUsersOnce(result);
        } else {
            UsersDBMethods.loadUsersOnce(result);
        }
    }

    public static saveUser = (userId: string, user: UserWithoutId) => {
        //if (DBMethods.isFirestore) {
        //    UsersDBFirestoreMethods.saveUser(userId, user);
        //} else {
        //    UsersDBMethods.saveUser(userId, user);
        //}
        UsersDBFirestoreMethods.saveUser(userId, user);
        UsersDBMethods.saveUser(userId, user);
    }

    public static getUserById = (
        uid: string,
        result: (user: User) => void,
        err: (mes:string)=> void,
    ) => {
        if (DBMethods.isFirestore) {
            UsersDBFirestoreMethods.getUserById(uid, result, err);
        } else {
            UsersDBMethods.getUserById(uid, result, err);
        }
    }

    public static updateUser = (user: User, result: () => void) => {
        if (DBMethods.isFirestore) {
            UsersDBFirestoreMethods.updateUser(user, result);
        } else {
            UsersDBMethods.updateUser(user, result);
        }
    }

    public static setInactiveStateofUser = (uid: string, result: () => void) => {
        if (DBMethods.isFirestore) {
            UsersDBFirestoreMethods.setInactiveStateofUser(uid, result);
        } else {
            UsersDBMethods.setInactiveStateofUser(uid, result);
        }
    }

    public static loadUsersOn = (result: (users: Array<User>) => void): (() => void) | null => {
        if (DBMethods.isFirestore) {
            return UsersDBFirestoreMethods.loadUsersOn(result);
        } else {
            return UsersDBMethods.loadUsersOn(result);
        }
    }

    public static loadUsersOff = () => {
        if (!DBMethods.isFirestore) {
               UsersDBMethods.loadUsersOff();
        }
    }

    public static loadMap = (users: Array<User>) => {
        const mapUsers = new Map<string, string>();
        users.forEach((user: User) => {
            mapUsers.set(user.uid, user.username);
        });
        DBMethods.mapUserIdToUserName = mapUsers;
    }

    public static removeUser = (uid: string) => {
        if (DBMethods.isFirestore) {
            UsersDBFirestoreMethods.removeUser(uid);
        } else {
            UsersDBMethods.removeUser(uid);
        }
    }

    public static moveAllUsersToFirestore = () => {

        const saveToFirestore = (users: Array<User>) => {
            users.forEach((user) => {
                const { uid, ...rest } = user;
                UsersDBFirestoreMethods.saveUser(uid, rest);
            })
            
        }
        UsersDBMethods.loadUsersOnce(saveToFirestore);
    }

    //-------thoughts-------------------------------------

    public static getThoughtsOnce = (
        uid: string,
        result: (val: UserThoughtsData) => void,
        error: () => void,
    ) => {
        if (DBMethods.isFirestore) {
            ThoughtsDBFirestoreMethods.getThoughtsOnce(uid,result,error);
        } else {
            ThoughtsDBMethods.getThoughtsOnce(uid, result, error);
        }
    }

    public static setThougths = (uid: string, data: UserThoughtsData) => {
        if (DBMethods.isFirestore) {
            ThoughtsDBFirestoreMethods.setThougths(uid, data);
        } else {
            ThoughtsDBMethods.setThougths(uid, data);
        }
    }
    //---------time-----------------------
    public static getServerTime = () => {
        if (DBMethods.isFirestore) {
            const date: number = Firebase.getFirebase().serverValueFirestoreTimestamp.now().seconds * 1000;
            return date;
        } else {
            return Firebase.getFirebase().serverValue.TIMESTAMP;
        }
    }
}