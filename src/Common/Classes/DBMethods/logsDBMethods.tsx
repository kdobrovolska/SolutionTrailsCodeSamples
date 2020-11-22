import { LogData, StatisticLogData, StatisticLogDataWithUserNames } from "../../interfaces";
import { DBMethods } from "./DBMethods";
import Firebase from '../../../components/Firebase/firebase';

export class LogsDBMethods {
    public static execOperationLogsForTrail = (
        fieldName: string,
        fieldValue: string,
        operationTrailLogDataList?: (logs: Array<LogData>) => void,
        operationTrailLogDataKeyList?: (keys: Array<string>) => void,
    ) => {
        LogsDBMethods.logs()
            .orderByChild(fieldName)
            .equalTo(fieldValue)
            .once('value')
            .then((snapshot: any) => {
                if (snapshot) {
                    const logsObject = snapshot.val();
                    if (logsObject) {
                        const logs: Array<LogData> = [];
                        const keys: Array<string> = [];
                        Object.keys(logsObject).forEach((key) => {
                            logs.push(logsObject[key]);
                            keys.push(key);
                        });
                        if (operationTrailLogDataList) {
                            operationTrailLogDataList(logs);
                        }
                        if (operationTrailLogDataKeyList) {
                            operationTrailLogDataKeyList(keys);
                        }
                    }
                }
            });
    }

    public static readStatisticLogAll = (
        returnStatusticLogDataList: (logs: Array<StatisticLogDataWithUserNames>) => void,
    ) => {
        const mapUsers: Map<string, string> = DBMethods.mapUserIdToUserName;
        LogsDBMethods.statisticLogs()
            .orderByChild("stepNumber") //("lastUpdate")
            .once('value')
            .then((snapshot: any) => {
                if (snapshot) {
                    const logsObject = snapshot.val();
                    if (logsObject) {
                        const logs: Array<StatisticLogDataWithUserNames> = [];
                        Object.keys(logsObject).forEach((key) => {
                            const logData: StatisticLogData = logsObject[key];
                            //   console.log('logData.authorId', logData.authorId);
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
                }
            });
    }

    public static execOperationStatisticLogKeyAll = (
        userId: string,
        trailId: string,
        operationStatusticLogDataKeyList: (logs: Array<string>) => void,
    ) => {
            LogsDBMethods.statisticLogs()
                .orderByChild("trailId") //("lastUpdate")
                .equalTo(trailId)
                // .limitToLast(4)
                .once('value')
                .then((snapshot: any) => {
                    if (snapshot) {
                        const logsObject = snapshot.val();
                        if (logsObject) {
                            const logKeys: Array<string> = [];
                            Object.keys(logsObject).forEach((key) => {
                                const logData: StatisticLogData = logsObject[key];
                                if (userId.length === 0 || logData.userId === userId) {
                                    logKeys.push(key);
                                }
                            });
                            operationStatusticLogDataKeyList(logKeys);
                        }
                    }
                });
    }

    public static loadStatisticLogsOn = (userId: string,
        before: () => void,
        result: (logData: StatisticLogData) => void) => {
        LogsDBMethods.statisticLogs()
            .orderByChild("userId")
            .equalTo(userId)
            .on('child_added', (snapshot: any) => {
                if (snapshot) {
                    const logData: StatisticLogData = snapshot.val();
                    result(logData);
                  //  console.log('logData.authorId', logData.authorId);
                }
            });
    }   

    public static loadStatisticsOff = () => {
        LogsDBMethods.statisticLogs().off()
    }

    public static readStatisticLogOn = (
        before: () => void,
         returnStatusticLogDataList: (log: StatisticLogDataWithUserNames) => void,
    ) => {
            LogsDBMethods.statisticLogs()
                .orderByChild("lastUpdate")
                //  .equalTo(1)
                //  .limitToLast(2)
                .on('child_added', (snapshot: any) => {
                    if (snapshot) {
                        const mapUsers: Map<string, string> = DBMethods.mapUserIdToUserName;
                        const logData: StatisticLogData = snapshot.val();
                        const authorUserName = mapUsers.get(logData.authorId);
                        const userName = mapUsers.get(logData.userId);
                        const statisticLogDataWithUserNames: StatisticLogDataWithUserNames = {
                            ...logData,
                            authorUserName: authorUserName ? authorUserName : '',
                            userName: userName ? userName : '',
                        };
                        returnStatusticLogDataList(statisticLogDataWithUserNames);
                    }
                });
        
    }

    public static readStatisticLogOff = () => {
        LogsDBMethods.statisticLogs().off();
    }

   

    public static removeLogsForTrailUser = (
        userId: string,
        trailId: string,
        afterAswersRemoved?: () => void,

    ) => {
        LogsDBMethods.removeLogsByField(
            "userId_trailId",
            userId + '_' + trailId,
            afterAswersRemoved,
        );
    }

    public static removeLogsForTrail = (
        trailId: string,
        afterAswersRemoved?: () => void,

    ) => {
        LogsDBMethods.removeLogsByField(
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
            keys.forEach((key: string) => {
                LogsDBMethods.log(key).remove();
            });
            if (afterAswersRemoved) {
                afterAswersRemoved();
            }
        }

        LogsDBMethods.execOperationLogsForTrail(
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
                LogsDBMethods.statisticLog(key).remove();
            });
        }

        LogsDBMethods.execOperationStatisticLogKeyAll(
            userId,
            trailId,
            getStatlisticsLog
        );
    }

    public static removeStatlisticsLogForTrail = (
        trailId: string,

    ) => {
        LogsDBMethods.removeStatlisticsLogForTrailUser('', trailId);
    }

    public static saveLogData = (id: string, log: LogData) => {
        LogsDBMethods
            .log(id)
            .set(log);
    }

    public static saveStatisticLogData = (id: string, statLog: StatisticLogData) => {
        LogsDBMethods
            .statisticLog(id)
            .set(statLog);
    }

    private static log = (uid: string) => {
        return Firebase.getFirebase().db.ref(`logs/${uid}`);
    }

    private static logs = () => {
        return Firebase.getFirebase().db.ref('logs');
    }

    private static  statisticLog = (uid: string) => Firebase.getFirebase().db.ref(`statisticlogs/${uid}`);

    private static statisticLogs = () => Firebase.getFirebase().db.ref('statisticlogs');



} 