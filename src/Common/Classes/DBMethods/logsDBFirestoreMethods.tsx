import { LogData, StatisticLogData, StatisticLogDataWithUserNames }
    from "../../interfaces";
import Firebase from '../../../components/Firebase/firebase';
import { DBMethods } from "./DBMethods";

export class LogsDBFirestoreMethods {

    private static unsubscribeStatisticLogsOn: () => void = () => { };
    private static unsubscribeLogsOn: () => void = () => { };

    public static execOperationLogsForTrail = (
        fieldName: string,
        fieldValue: string,
        operationTrailLogDataList?: (logs: Array<LogData>) => void,
        operationTrailLogDataKeyList?: (keys: Array<string>) => void,
    ) => {
        LogsDBFirestoreMethods.logs()
            .where(fieldName, "==", fieldValue)
           // .orderBy(fieldName)
            .get()
            .then((query: any) => {
                if (query) {
                    const logs: Array<LogData> = [];
                    const keys: Array<string> = [];
                    query.forEach((doc: any) => {
                        logs.push(doc.data());
                        keys.push(doc.id);
                    });
                    if (operationTrailLogDataList) {
                        operationTrailLogDataList(logs);
                    }
                    if (operationTrailLogDataKeyList) {
                        operationTrailLogDataKeyList(keys);
                    }
                }
            });
    }

    public static readStatisticLogAll = (
        returnStatusticLogDataList: (logs: Array<StatisticLogDataWithUserNames>) => void,
    ) => {
        const mapUsers = DBMethods.mapUserIdToUserName;
        LogsDBFirestoreMethods.statisticLogs()
            .orderBy("stepNumber") 
            .get()
            .then((query: any) => {
                if (query) {
                    const logs: Array<StatisticLogDataWithUserNames> = [];
                    query.forEach((doc: any) => {
                        const logData: StatisticLogData = doc.data();
                        const authorUserName = mapUsers.get(logData.authorId);
                        const userName = mapUsers.get(logData.userId);
                        const statisticLogDataWithUserNames: StatisticLogDataWithUserNames = {
                            ...logData,
                            authorUserName: authorUserName ? authorUserName : '',
                            userName: userName ? userName : '',
                        };
                        logs.push(statisticLogDataWithUserNames);
                    });
                    returnStatusticLogDataList(logs);
                }
            });
    }

    private static execOperationStatisticLogKeyAll = (
        userId: string,
        trailId: string,
        operationStatusticLogDataKeyList: (logs: Array<string>) => void,
    ) => {
        LogsDBFirestoreMethods.statisticLogs()
            .where("trailId", "==", trailId)
            // .orderBy("trailId")
            .get()
            .then((query: any) => {
                if (query) {
                    const logKeys: Array<string> = [];
                    query.forEach((doc: any) => {
                        const logData: StatisticLogData = doc.data();
                        if (userId.length === 0 || logData.userId === userId) {
                            logKeys.push(doc.id);
                        }
                    })
                    operationStatusticLogDataKeyList(logKeys);
                }
            });
    }

    public static loadStatisticLogsOn = (
        userId: string,
        beforeDataSent: () => void,
        result: (logData: StatisticLogData) => void,
    ) => {
        const unsubscribeStatisticLogsOn = LogsDBFirestoreMethods.statisticLogs()
            .where("userId", "==", userId)
           // .orderBy("userId")
            .onSnapshot((querySnapshot: any) => {
                beforeDataSent();
                
                querySnapshot.forEach((doc: any) => {
                    if (doc) {
                        const logData: StatisticLogData = doc.data();
                        result(logData);
                    }
                });
            });
        LogsDBFirestoreMethods.unsubscribeStatisticLogsOn= unsubscribeStatisticLogsOn;
    }   

    public static loadStatisticsOff = () => {
        LogsDBFirestoreMethods.unsubscribeStatisticLogsOn();
        LogsDBFirestoreMethods.unsubscribeStatisticLogsOn = () => { };
    }

    public static readStatisticLogOn = (
        beforeDataSent: (() => void),
        returnStatusticLogDataList: (log: StatisticLogDataWithUserNames) => void,
    ) => {
            LogsDBFirestoreMethods.unsubscribeLogsOn = LogsDBFirestoreMethods.statisticLogs()
                .orderBy("lastUpdate")
                .onSnapshot((querySnapshot: any) => {
                    beforeDataSent();
                    querySnapshot.forEach((doc: any) => {
                        if (doc) {
                            const logData: StatisticLogData = doc.data();
                            const mapUsers = DBMethods.mapUserIdToUserName;
                          
                            const authorUserName = mapUsers.get(logData.authorId);
                            const userName = mapUsers.get(logData.userId);
                            const statisticLogDataWithUserNames: StatisticLogDataWithUserNames = {
                                ...logData,
                                authorUserName: authorUserName ? authorUserName : '',
                                userName: userName ? userName : '',
                            };
                            console.log('statisticLogDataWithUserNames', statisticLogDataWithUserNames);
                            console.log('map', mapUsers);
                            returnStatusticLogDataList(statisticLogDataWithUserNames);
                        }
                    });
                });
    }

    public static readStatisticLogOff = () => {
        LogsDBFirestoreMethods.unsubscribeLogsOn();
        LogsDBFirestoreMethods.unsubscribeLogsOn = () => { };
    }

    public static removeLogsForTrailUser = (
        userId: string,
        trailId: string,
        afterAswersRemoved?: () => void,

    ) => {
        LogsDBFirestoreMethods.removeLogsByField(
            "userId_trailId",
            userId + '_' + trailId,
            afterAswersRemoved,
        );
    }

    public static removeLogsForTrail = (
        trailId: string,
        afterAswersRemoved?: () => void,

    ) => {
        LogsDBFirestoreMethods.removeLogsByField(
            "trailId",
            trailId,
            afterAswersRemoved,
        );

    }

    private static removeLogsByField = (
        fieldName: string,
        fieldValue: string,
        afterAswersRemoved?: () => void,

    ) => {
        const getlogKeys = (keys: Array<string>) => {
            const promises: Array<Promise<void>> = [];
            keys.forEach((key: string) => {
                promises.push(LogsDBFirestoreMethods.log(key).delete());
            });
            Promise.all(promises).then(() => {
                if (afterAswersRemoved) {
                    afterAswersRemoved();
                }
            });
        }

        LogsDBFirestoreMethods.execOperationLogsForTrail(
            fieldName,
            fieldValue,
            undefined,
            getlogKeys
        );
    }

    public static removeStatlisticsLogForTrailUser = (
        userId: string,
        trailId: string,

    ) => {
        const getStatlisticsLog = (logKeys: Array<string>) => {
            logKeys.forEach((key: string) => {
                LogsDBFirestoreMethods.statisticLog(key).delete();
            });
        }

        LogsDBFirestoreMethods.execOperationStatisticLogKeyAll(
            userId,
            trailId,
            getStatlisticsLog
        );
    }

    public static removeStatlisticsLogForTrail = (
        trailId: string,
    ) => {
        LogsDBFirestoreMethods.removeStatlisticsLogForTrailUser('', trailId);
    }

    public static saveLogData = (id: string, log: LogData) => {
        LogsDBFirestoreMethods.log(id).set(log);
    }

    public static saveStatisticLogData = (id: string, statLog: StatisticLogData) => {
        LogsDBFirestoreMethods.statisticLog(id).set(statLog);
    }

    private static log = (uid: string) => {
        return Firebase.getFirebase().dbFirestore.collection(`logs`).doc(uid);
    }
    private static logs = () => {
        return Firebase.getFirebase().dbFirestore.collection('logs');
    }

    private static statisticLog = (uid: string) => {
        return Firebase.getFirebase().dbFirestore.collection(`statisticlogs`).doc(uid);
    }
    private static statisticLogs = () => {
        return Firebase.getFirebase().dbFirestore.collection('statisticlogs');
    }

} 