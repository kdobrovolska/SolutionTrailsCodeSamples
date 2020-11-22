import { TrailInterfaceEx, User, BaseTrailInterface, StepData, StepItemType } from "../../../Common/interfaces";
import { DBMethods } from "./DBMethods";
import { LogsDBFirestoreMethods } from "./logsDBFirestoreMethods";
import { Roles } from "../roles";
import Firebase from '../../../components/Firebase/firebase';

export class TrailDBFirestoreMethods {
    private static unsubscribeLoadTrailsOn: () => void = () => { };

    public static loadTrailsOn = (
        authUser: User | undefined | null,
        beforeTrailsSent: () => void,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void
    ) => {
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

        TrailDBFirestoreMethods.unsubscribeLoadTrailsOn =
            TrailDBFirestoreMethods.trailsFirestore()
                .orderBy("title")
                .onSnapshot((querySnapshot: any) => {
                    beforeTrailsSent();
                    querySnapshot.forEach((doc: any) => {
                        if (doc) {
                            const trail: TrailInterfaceEx = TrailDBFirestoreMethods.getTrailFromDoc(doc);
                            TrailDBFirestoreMethods.connectTrailWithUser(trail, false, addTrail, checkTrail);
                        }
                    });
                });
    }

    public static loadTrailsOff = () => {
        TrailDBFirestoreMethods.unsubscribeLoadTrailsOn();
        TrailDBFirestoreMethods.unsubscribeLoadTrailsOn = () => { };
    }

    private static getTrailFromDoc = (doc: any): TrailInterfaceEx => {
        const trail: TrailInterfaceEx = doc.data();
        if (trail) 
            trail.uid = doc.id;
        return trail;
    }


    public static loadTrail = (
        uidTrail: string,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void,
        isMyRunningTrails: boolean,
    ) => {
        TrailDBFirestoreMethods.trailFirestore(uidTrail)
            .get()
            .then((doc: any) => {
                if (doc) {
                    const trail: TrailInterfaceEx = TrailDBFirestoreMethods.getTrailFromDoc(doc);
                    TrailDBFirestoreMethods.connectTrailWithUser(trail, isMyRunningTrails, addTrail);
                }
            });
    }

    private static connectTrailWithUser = (
        trail: TrailInterfaceEx | undefined,
        isMyRunningTrails: boolean,
        addTrail: (trail: TrailInterfaceEx, isMyRunningTrails: boolean) => void,
        checkTrail?: (trail: TrailInterfaceEx) => boolean,
    ) => {
        if (trail) {
             if (!checkTrail || checkTrail(trail)) {
                 if (trail.uidAuthor && trail.uidAuthor.length > 0) {
                     const mapUsers = DBMethods.mapUserIdToUserName;
                     const author = mapUsers.get(trail.uidAuthor);
                     if (author) {
                         trail.author = author;
                     }
                 }
                 addTrail(trail, isMyRunningTrails);
             }
        }
    }


    public static loadStepsTrail = (
        uidTrail: string,
        addSteps: (stepsStringified: string) => void
    ) => {
        TrailDBFirestoreMethods.stepsTrailFirestore(uidTrail)
            .get()
            .then((doc: any) => {
                const val: any = doc.data();
                //console.log('loadStepsTrail', val); // ?????
                if (val) {
                    addSteps(val['steps']);
                }
            });
    }


    public static makeUserTrailsInActive = (
        userId: string,
        operationFinished?: () => void
    ) => {
        TrailDBFirestoreMethods.trailsFirestore()
            .get()
            .then((querySnapshot: any) => {
                const updatePromises: Array<Promise<void>> = [];
                querySnapshot.forEach((doc: any) => {
                    const trail: TrailInterfaceEx = TrailDBFirestoreMethods.getTrailFromDoc(doc);
                    if (trail.active && trail.uidAuthor === userId) {
                        const updatePromise: Promise<void> = TrailDBFirestoreMethods.trailFirestore(trail.uid)
                            .update({ active: false });
                        updatePromises.push(updatePromise);
                    }
                });
                if (operationFinished) {
                    Promise.all(updatePromises).then(() => {
                        operationFinished();
                    })
                }
            });
    }

    public static removeTrail = (
        uidTrail: string,
        finishRemove: () => void,
        errorRemove: () => void
    ) => {
        TrailDBFirestoreMethods.trailFirestore(uidTrail).delete()
            .then(() => {
                TrailDBFirestoreMethods.stepsTrailFirestore(uidTrail).delete()
                    .then(() => {
                        LogsDBFirestoreMethods.removeLogsForTrail(uidTrail);
                        LogsDBFirestoreMethods.removeStatlisticsLogForTrail(uidTrail);
                        Firebase.getFirebase().trailImages(uidTrail).listAll()
                            .then((result: any) => {
                                result.items.forEach((file: any) => {
                                    file.delete();
                                });
                                finishRemove();
                            }).catch((error: any) => {
                                errorRemove();
                            });
                })
            })
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
            TrailDBFirestoreMethods.trailsFirestore().add({
                    ...trail,
                    createdAt: time,
                    editedAt: time,
                    uidAuthor: authUserUid,
                })
                .then((doc: any) => {
                    uidTrail = doc.id;
                    if (uidTrail) {
                        setUidTrailInState(uidTrail);
                        TrailDBFirestoreMethods.saveTrailImage(trail, uidTrail, imageFile, setTrailBaseInState);
                        TrailDBFirestoreMethods.saveStepsPictures([...steps], uidTrail);
                    }
                });
            
        } else {
            TrailDBFirestoreMethods.trailFirestore(uidTrail).set({
                ...trail,
                createdAt: trail.createdAt ? trail.createdAt : time,
                editedAt: time,
                uidAuthor: trail.uidAuthor && trail.uidAuthor.length ? trail.uidAuthor : authUserUid,
            })
            .then(() => {
                if (uidTrail) {
                    TrailDBFirestoreMethods.saveTrailImage(trail, uidTrail, imageFile, setTrailBaseInState);
                    TrailDBFirestoreMethods.saveStepsPictures([...steps], uidTrail);
                }
            });
        }
    }

    private static saveStepsPictures = (steps: StepData[], trailId: string) => {
        let countPictures = 0;
        steps.forEach(step => {
            step.items.forEach(item => {
                if (item.type === StepItemType.Picture && item.imageFile) {
                    countPictures++;
                }
            })
        });

        if (countPictures === 0) {
            TrailDBFirestoreMethods.stepsTrailFirestore(trailId).set({
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
                                    TrailDBFirestoreMethods.stepsTrailFirestore(trailId).set({
                                        steps: JSON.stringify(steps)
                                    });
                                }
                            });
                        });
                }
            })
        });
    }

    private static saveTrailImage = (
        trailBase: BaseTrailInterface,
        trailId: string,
        file: any,
        setTrailBaseInState: ((trailBase: BaseTrailInterface) => void),
    ) => {
        // save trail title image
        const firebase = Firebase.getFirebase();
        if (file) {
            var fileName = 'title.' + file.name.split('.').pop();
            firebase.image(trailId, fileName).put(file)
                .then((snapshot: any) => {
                    snapshot.ref.getDownloadURL().then((downloadURL: any) => {
                        trailBase.image = downloadURL;
                        setTrailBaseInState(trailBase);
                        TrailDBFirestoreMethods.trailFirestore(trailId).update({
                            image: downloadURL
                        });
                    });
                });
        }
    }
    // *** Trail API ***
    private static  trailFirestore = (uid: string) => {
        return Firebase.getFirebase().dbFirestore.collection('trails').doc(uid);
    };

    private static  trailsFirestore = () => {
        return Firebase.getFirebase().dbFirestore.collection('trails');
    }

    private static stepsTrailFirestore = (uid: string) => {
        return Firebase.getFirebase().dbFirestore.collection('stepsTrails').doc(uid);

    }
}