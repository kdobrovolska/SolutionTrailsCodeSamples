import { TrailInterfaceEx, User, BaseTrailInterface, StepData, StepItemType }
    from "../../../Common/interfaces";
import { DBMethods } from "./DBMethods";
import { Roles } from "../roles";
import Firebase from '../../../components/Firebase/firebase';

export class TrailDBMethods {
    public static loadTrailsOn = (
        authUser: User | undefined | null,
        beforeTrailsSent: () => void,
        addTrail: (trail: TrailInterfaceEx,isMyRunningTrails: boolean) => void
    ) => {
            TrailDBMethods.trails()
                .orderByChild("title")
                // .limitToFirst(2)
                .on('child_added', (snapshot: any) => {
                    const checkTrail = (trail: TrailInterfaceEx): boolean => {
                      //  console.log('trail time =', Date.now().toString());

                        if (!authUser) {
                            return trail.active && trail.public;
                        } else {
                            if (Roles.hasAdminPermission(authUser.roles)) {
                                return true;
                            } else if (Roles.hasEditorPermission(authUser.roles)) {
                                return (trail.active && trail.public) || trail.uidAuthor === authUser.uid;
                            } else {
                                return trail.active && trail.public;
                            }
                        }
                    };

                    TrailDBMethods.connectTrailWithUser(snapshot, false, addTrail, checkTrail);
                });
    }

    public static loadTrailsOff = () => {
        TrailDBMethods.trails().off();
    }


    public static loadTrail = (
        uidTrail: string,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void,
        isMyRunningTrails: boolean,
    ) => {
        TrailDBMethods.trail(uidTrail)
            .once('value')
            .then((snapshot: any) => {
                TrailDBMethods.connectTrailWithUser(snapshot, isMyRunningTrails, addTrail);    
            });
    }

    private static connectTrailWithUser = (
        snapshot: any,
        isMyRunningTrails: boolean,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void,
        checkTrail?: (trail: TrailInterfaceEx) => boolean,
    ) => {
        const trail: TrailInterfaceEx | undefined = snapshot.val();
        if (trail) {
            trail.uid = snapshot.key;
            if (!checkTrail || checkTrail(trail)) {
                if (trail.uidAuthor && trail.uidAuthor.length > 0) {
                    const mapUsers: Map<string, string> = DBMethods.mapUserIdToUserName;
                    const author = mapUsers.get(trail.uidAuthor);
                    if (author) {
                        trail.author = author;
                    }
                }
                addTrail(trail, isMyRunningTrails);
            }
        }
    }


    public static loadStepsTrail = (uidTrail: string, addSteps: (stepsStringified: string) => void) => {
        TrailDBMethods.stepsTrail(uidTrail)
            .once('value')
            .then((snapshot: any) => {
                const val: any = snapshot.val();
                if (val) {
                    addSteps(val['steps']);
                }
            });
    }


    public static makeUserTrailsInActive = (userId: string, operationFinished?: () => void) => {
        TrailDBMethods.trails()
            .once('value').then((snapsort: any) => {
                const val = snapsort.val();
                const keys: Array<string> = Object.keys(val);
                keys.forEach((key: string) => {
                    const trail: TrailInterfaceEx = val[key];
                    trail.uid = key;
                    if (trail.active && trail.uidAuthor === userId) {
                        TrailDBMethods.trail(key).update({ active: false });
                    }
                });
                if (operationFinished) {
                    operationFinished();
                }
            });
    }

    public static removeTrail = (uidTrail: string, finishRemove: () => void, errorRemove: () => void) => {
        TrailDBMethods.trail(uidTrail).remove();
        TrailDBMethods.stepsTrail(uidTrail).remove();
        DBMethods.removeLogsForTrail(uidTrail);
        DBMethods.removeStatlisticsLogForTrail(uidTrail);
        Firebase.getFirebase().trailImages(uidTrail)
            .listAll().then((result: any) => {
                result.items.forEach((file: any) => {
                    file.delete();
                });
                finishRemove();
            }).catch((error: any) => {
                errorRemove();
            });

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
        const time = DBMethods.getServerTime();
       
        let uidTrail: string | null = uidTrailCurrent;

        if (!uidTrail) {
            uidTrail =
                TrailDBMethods.trails().push({
                    ...trail,
                    createdAt: time,
                    editedAt: time,
                    uidAuthor: authUserUid,
                }).key;
            if (uidTrail) {
                setUidTrailInState(uidTrail);
            }
        } else {
            TrailDBMethods.trail(uidTrail).set({
                ...trail,
                createdAt: trail.createdAt ? trail.createdAt : time,
                editedAt: time,
                uidAuthor: trail.uidAuthor && trail.uidAuthor.length ? trail.uidAuthor : authUserUid,
            });
        }
        if (uidTrail) {
            TrailDBMethods.saveTrailImage(trail, uidTrail, imageFile, setTrailBaseInState);
            TrailDBMethods.saveStepsPictures([...steps], uidTrail);
        }
    }

    public static saveStepsPictures = (steps: StepData[], trailId: string) => {
        let countPictures = 0;
        steps.forEach(step => {
            step.items.forEach(item => {
                if (item.type === StepItemType.Picture && item.imageFile) {
                    countPictures++;
                }
            })
        });

        if (countPictures === 0) {
            TrailDBMethods.stepsTrail(trailId).set({
                steps: JSON.stringify(steps)
            });
            return;
        }

        steps.forEach((step, stepIndex) => {
            step.items.forEach((item, itemIndex) => {
                if (item.type === StepItemType.Picture && item.imageFile) {
                    const file = item.imageFile;
                    var fileName = 'step' + stepIndex + '_item' + itemIndex + '.' + file.name.split('.').pop();
                    Firebase.getFirebase().image(trailId, fileName).put(file)
                        .then((snapshot: any) => {
                            snapshot.ref.getDownloadURL().then((downloadUrl: any) => {
                                item.image = downloadUrl;
                                item.imageFile = undefined;
                                countPictures--;
                                if (countPictures === 0) {
                                    TrailDBMethods.stepsTrail(trailId).set({
                                        steps: JSON.stringify(steps)
                                    });
                                }
                            });
                        });
                }
            })
        });
    }

    public static saveTrailImage = (
        trailBase: BaseTrailInterface,
        trailId: string,
        file: any,
        setTrailBaseInState: ((trailBase: BaseTrailInterface) => void),
    ) => {
        // save trail title image
        if (file) {
            var fileName = 'title.' + file.name.split('.').pop();
            Firebase.getFirebase().image(trailId, fileName).put(file)
                .then((snapshot: any) => {
                    snapshot.ref.getDownloadURL().then((downloadURL: any) => {
                        trailBase.image = downloadURL;
                        setTrailBaseInState(trailBase);
                        TrailDBMethods.trail(trailId).update({
                            image: downloadURL
                        });
                    });
                });
        }
    }

    private static stepsTrail = (uid: string) => {
        return Firebase.getFirebase().db.ref(`stepsTrails/${uid}`);
    }

    private static  trail = (uid: string) => {
        return Firebase.getFirebase().db.ref(`trails/${uid}`);
    };
    private static  trails = () => {
        return Firebase.getFirebase().db.ref('trails');
    }

}