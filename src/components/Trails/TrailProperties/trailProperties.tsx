import React, {ChangeEvent, createRef, RefObject, useState, useEffect, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import '../trails.css'
import '../steps.css'
import { Steps } from '../Steps/steps';
import { AddEditStepItem } from '../AddStepItem/addStepItem';
import { BaseTrailInterface, TrailInterfaceEx, User } from "../../../Common/interfaces";
import { LeftPanel, RightPanel } from "../TrailPropertiesPanels/trailPropertiesPanels";
import { getStepDataWithAnswers } from "../../../Common/methods";
import { ShowStep } from '../ShowStep/showStep';
import { DialogMoving } from "../DialogMoving/dialogMoving";
import { getName } from '../../../Common/methods';
import { DBMethods } from '../../../Common/Classes/DBMethods/DBMethods';
import { ImageData } from "../../Common/ImageUpload";
import { StepsContext, StepsContextValue } from '../StepsReducer';


interface TrailPropertiesData  {
    uidTrail: string;
    isPreviwStepRegime: boolean;
    imageFile: File | null | undefined;
    w: number;
    h: number;
    heightSteps: number | undefined;
    isAllSaved: boolean;
};

export interface TrailPropertiesProps extends RouteComponentProps{
    isEdit: boolean;
    authUser: User;
    trail?: TrailInterfaceEx;
    gotoTrailDetail?: () => void;
    imageFile: File | undefined;
    isAllSaved: boolean;
}


export const TrailProperties = (props: TrailPropertiesProps) => {
    const [baseTrail, setBaseTrail] = useState<BaseTrailInterface>(() => {
        if (props.trail) {
            const { uid, author, ...baseTrail } = props.trail;
            return baseTrail;
        } else {
            const bTrail: BaseTrailInterface = {
                title: '',
                shortdescription: '',
                public: false,
                active: false,
                area: '',
                subject: '',
                category: '',
                description: '',
                location: '',
                city: '',
                createdAt: undefined,
                editedAt: undefined,
                image: '',
                uidAuthor: '',
            };
            return bTrail;
        }
    });

    const [data, setData] = useState<TrailPropertiesData>({
        uidTrail: props.trail ? props.trail.uid : '',
        isPreviwStepRegime: false,
        imageFile: props.imageFile,
        w: window.innerWidth,
        h: window.innerHeight,
        heightSteps: undefined,
        isAllSaved: props.isAllSaved,
    });

    const refLeftPanel: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    const stepsContentValue: StepsContextValue = useContext<StepsContextValue>(StepsContext);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {window.removeEventListener('resize', handleResize);}
    }, []);

    const handleResize = () => {
        setData(prev => ({
            ...prev,
            w: window.innerWidth,
            h: window.innerHeight,
        }));
    }

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setBaseTrail(prev => ({
            ...prev,
            [name]: value,
        }))
        setData(prev => ({
            ...prev,
            isAllSaved: false
        })) 
    }

    const onChangeCheckbox = (event: any) => {
        const { name, value } = event.target;
        setBaseTrail(prev => ({
            ...prev,
            [name]: value,
        }))
        setData(prev => ({
            ...prev,
            isAllSaved: false,
        })) 
    };

    const onSaveClick = () => {
        setData(prev => ({
            ...prev,
            isAllSaved: true,
        }))
        saveTrail(baseTrail);
        stepsContentValue.clearIsChanged();
    }
   
    const setTrailBaseInState = (trailBase: BaseTrailInterface) => {
        setBaseTrail(trailBase );
    }

    const setUidTrailInState = (uidTrailNew: string) => {
        setData(prev => ({
            ...prev,
            uidTrail: uidTrailNew,
        }));
    }

    const saveTrail = (trail: BaseTrailInterface) => {
        const uidTrail = data.uidTrail;
        const authUserUid = props.authUser.uid;
        const imageFile = data.imageFile;
        const steps = stepsContentValue.steps;
        DBMethods.saveTrail(trail, uidTrail, authUserUid, imageFile, steps,
           setTrailBaseInState,
           setUidTrailInState);
    }    

    

    const setPreviwRegime = () => {
        setData(prev => ({
            ...prev,
            isPreviwStepRegime: !prev.isPreviwStepRegime,
        }));
    }


    const onImageChange = (data: ImageData) => {
        setBaseTrail(prev => ({
            ...prev,
            image: data.imageUrl,
        }));
        setData(prev => ({
            ...prev,
            imageFile: data.imageFile,
            isAllSaved: false,
        }))
     }

    const getStyle = () => {
        if (window.innerWidth < 800) {
                    return {};
        } else {
            return {
                height: (window.innerHeight - 40 - 50 - 20 - 6) + 'px',
                overflow: 'auto',
            };
        }
    }

    return (
        <div className="main_trail_properties" >
            <h2 className="trail_type_header">{
                props.isEdit
                    ? getName('EditTrail') + (data.isPreviwStepRegime ? ' (' + getName('Preview') + ')' : '')
                    : getName('AddNewTrail')
            }</h2>
            {props.isEdit && props.gotoTrailDetail && <div className="go_to_trip_detail_edit_trail link" onClick={props.gotoTrailDetail}>
                {getName('GoToTrailDetails')}
            </div>}
            <div className="contaner_main_trail_and_steps">
                <div className={data.isPreviwStepRegime ? "trail_panel_preview" : "trail_panel"}>
                    {!data.isPreviwStepRegime && (<div className="contaner_trail_left_right_panels" style={getStyle()}>
                            <div className="left_trail_properties" ref={refLeftPanel}>
                                <LeftPanel {...baseTrail} onChange={onChange} onChangeCheckbox={onChangeCheckbox}
                                        onImageChange={onImageChange} />
                            </div>
                        <div className="right_trail_properties">
                            <RightPanel {...baseTrail}
                                isSaveDisabled={(data.isAllSaved && !stepsContentValue.isChanged) || !(baseTrail.title.length && baseTrail.shortdescription)}
                                onChange={onChange}
                                onChangeCheckbox={onChangeCheckbox}
                                onClick={onSaveClick}
                            />
                            </div>
                        </div>
                    )}
                    {data.isPreviwStepRegime && stepsContentValue.currentStep &&
                        (<div className="contaner_trail_preview"  > 
                            <div className="panel_view" style={getStyle()}>
                            <ShowStep step={getStepDataWithAnswers(stepsContentValue.currentStep)}
                                isPreview={true} onAnswerChanged={() => { }} onStarClick={() => { }}/>
                            </div>
                        </div>
                    )}
                </div> 
                <div className={data.isPreviwStepRegime ? "steps_panel_preview" : "steps_panel"}>
                        <Steps
                             isPreview={data.isPreviwStepRegime}
                             previewStep={setPreviwRegime}
                        />
                </div>
            </div>
            {stepsContentValue.showAddEditStepItem && <AddEditStepItem/>}
            {stepsContentValue.showRemoveStepDialog && <DialogMoving width={400} minWidth={300} height={0}
                ok={() => stepsContentValue.removeStep()} isYesNo={true}
                cancel={() => stepsContentValue.hideShowRemoveStepDialog()}
                     title="Remove step" resizeWidthOnly={true}>
                <div className="dialog_question">{getName('DoYouWantRemoveStep')} </div>
                </DialogMoving>
            }
            {(stepsContentValue.showRemoveStepItemDialog >= 0 ) && <DialogMoving width={400} minWidth={300} height={0}
                ok={() => stepsContentValue.removeStepItem()} isYesNo={true}
                cancel={() => stepsContentValue.hideShowRemoveStepItemDialog()}
                title={getName("RemoveStepItem")} resizeWidthOnly={true}>
                <div className="dialog_question">{getName('DoYouWantRemoveStepItem')} </div>
            </DialogMoving>
            }
        </div>
    );
}

export default withRouter(TrailProperties);
