import React, { useState, useEffect, RefObject, createRef, useContext} from 'react';
import '../steps.css'
import '../common.css'

import Paging from '../Paging/paging';
import { StepItemType, StepItem, StepData } from '../../../Common/interfaces';
import { ShowImage } from '../../Common/ShowImage';
import { getName } from '../../../Common/methods';
import { StepsContext, StepsContextValue } from '../StepsReducer';

interface StepsProps {
    isPreview: boolean;
    previewStep: () => void;
}

interface StepItemProps {
    item: StepItem;
    index: number;
    count: number;
    removeStepItem: (index: number) => void;
    editStepItem: (index: number) => void;
    moveStepItem: (index: number, isUp: boolean) => void;
}

export const Steps = (props: StepsProps) => {
    const [hPanel, setHPanel] = useState<number | undefined>(undefined);
    const refLink1: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    const refLink2: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    const stepsContextValue: StepsContextValue = useContext<StepsContextValue>(StepsContext);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
 
    useEffect(() => {
            const h1 = refLink1.current?.clientHeight;
            const h2 = refLink2.current?.clientHeight;
            const hPanelNow = window.innerHeight - 40 - 50 - 40 - 20 - 30 - 9 - (h1 ? h1 : 0) - (h2 ? h2 : 0);
            if (hPanel !== hPanelNow) {
                setHPanel(hPanelNow);
            }
    }, [window.innerHeight, window.innerWidth]);

    const handleResize = () => {
        setHPanel(undefined);
    }

    const step: StepData | undefined = stepsContextValue.currentStep;
    const disableMoveStepForward = (stepsContextValue.currentStepNumber < stepsContextValue.stepsCount - 1)
        ? '' : 'disabled_link';
    const disableMoveStepBack = (stepsContextValue.currentStepNumber > 0) ? '' : 'disabled_link';
    const disableRemoveStep = (stepsContextValue.stepsCount > 0) ? '' : 'disabled_link';
    const styleSteps = hPanel
        ? {
            height: hPanel   + 'px',
        }
        : {};
    const isPreviesDisabled = !(stepsContextValue.stepsCount && stepsContextValue.steps[0].items.length);
    console.log('------stepsContextValue', stepsContextValue);
    return (
        <div className="steps_main" >
            <div ref={refLink1}>
                <div className="steps_title" >&nbsp;{getName('Steps')}&nbsp;</div>
                <div className="links" >
                    <div>
                        <span className="link" onClick={() => { stepsContextValue.addStep() }}>{getName('AddStep')}</span>
                        <span>&nbsp;|&nbsp;</span>
                        <span className={`link ${disableMoveStepBack}`} onClick={even => stepsContextValue.moveStep(true)}>
                            {getName('MoveStepBack')}
                        </span>
                        <span>&nbsp;|&nbsp;</span>
                        <span className={`link ${disableMoveStepForward}`} onClick={even => stepsContextValue.moveStep(false)}>
                            {getName('MoveStepForward')}
                        </span>
                    </div>
                    <div>
                        <span className={`link ${disableRemoveStep}`} onClick={stepsContextValue.removeStepRequest}>
                            {getName('RemoveStep')}
                        </span>
                        <span>&nbsp;|&nbsp;</span>
                        <SetStepPosition />
                    </div>
                </div>
                <div className="panel_step_header">
                    <h2 className="text_align_center">
                        {stepsContextValue.stepsCount > 0
                            ? ` ${getName('Step')} ${stepsContextValue.currentStepNumber + 1} ${getName('of')} ${stepsContextValue.stepsCount}`
                            :  getName('NoSteps') 
                        }
                    </h2>
                    <button onClick={props.previewStep} disabled={isPreviesDisabled}
                        className={isPreviesDisabled ? "link disabled_link" : "link"}
                    >
                        {props.isPreview ? getName('StopPreview') : getName('StartPreview')}
                    </button>
                </div>
            </div>
            {step && <div className="step_panel" >
                <div ref={refLink2}>
                    <div className="links" >
                        {stepsContextValue.currentStepNumber >= 0 && <span className="link" onClick={stepsContextValue.addStepItemRequest}>
                            {getName('AddStepItem')}
                        </span>}
                    </div>
                </div>
                <div className="items_data" style={styleSteps}>
                    <div className="inner_steps"  >
                        {
                            step.items.map((item, index) => {
                                const stepItemProps: StepItemProps = {
                                    item,
                                    index,
                                    count: step.items.length,
                                    removeStepItem: stepsContextValue.removeStepItemRequest,
                                    editStepItem: stepsContextValue.editStepItemRequest,
                                    moveStepItem: stepsContextValue.moveStepItem,
                                };
                                return (<div key={index} >
                                    {item.type === StepItemType.Text && <StepItemText {...stepItemProps} />}
                                    {item.type === StepItemType.Picture && <StepItemPicture{...stepItemProps} />}
                                    {item.type === StepItemType.Question && <StepItemQuestion {...stepItemProps} />}
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
            }
            <div className="paging_container">
                <Paging
                    current={stepsContextValue.currentStepNumber}
                    count={stepsContextValue.stepsCount}
                    onPagingClick={stepsContextValue.setCurrentStep}
                />
            </div>

        </div>
    );
};

const StepItemQuestion = (props: StepItemProps) => (
    <div className="step_item question">
        <div className="step_item_first_row">
            <Question isSelect={false} showText={true}/>
            <StepItemControls {...props}/>
        </div>
        <div className="value">{props.item.data}</div>
        <div className="key">{getName('Description')}: </div>
        <div className="value description">{props.item.description}</div>
    </div>
)

export interface TypeProps {
    isSelect: boolean;
    showText: boolean;
}

export const Question = (props: TypeProps) => {
    const title = props.showText ? (props.isSelect ? getName("Question") : getName("Question") + ":") : '';
    return (<div className="key"><QuestionIcon /> {title} </div>);
};

export const QuestionIcon = () => {
    
    return (<i className="fa fa-question-circle icon_color" ></i>);
};

const StepItemText = (props: StepItemProps) => (
    <div className="step_item text">
        <div className="step_item_first_row">
            <Text isSelect={false} showText={true}/>
            <StepItemControls {...props} />
        </div>
        <div className="value">{props.item.data}</div>
        <div className="key">{getName("Description")}: </div>
        <div className="value description">{props.item.description}</div>
    </div>
)

export const Text = (props: TypeProps) => {
    const title = props.showText
        ? (props.isSelect
            ? getName("Text")
            : getName("Text") + ":"
        ) : '';
    return (<div className="key"><TextIcon />{title} </div>);
};

export const TextIcon = () => {
    return <i className="fa fa-info-circle icon_color"></i>;
};

interface StarIconProps {
    isPreview: boolean,
    isItemImportant?: boolean,
    onClick: () => void,
};

export const StarIcon = (props: StarIconProps) => {
    const cl = props.isItemImportant ? "fa fa-star icon_color" : "fa fa-star icon_color_star";
    return props.isPreview
        ? < i className="fa fa-star icon_color_star_preview" onClick={() => { }} ></i >
        : < i className={cl} title={getName("MarkAsImportant")} onClick={props.onClick} ></i >;
};

const StepItemPicture = (props: StepItemProps) => (
    <div className="step_item picture">
        <div className="step_item_first_row">
            <Picture isSelect={false} showText={true}/>
            <StepItemControls {...props} />
        </div>
        <div className="value">{props.item.data}</div>
        {props.item.image && props.item.image.length && <div style={{ minHeight: 120 + 'px' }}>
            {props.item.image && <ShowImage imageUrl={props.item.image} size={120} unit="px" marginRight={true}/>}
            <div className="key">{getName('Description')}: </div>
                <div className="value description">{props.item.description}</div>
            </div>
        }
        {(!props.item.image || !props.item.image.length ) && <div>
            <div className="key">{getName('Description')}: </div>
                <div className="value description">{props.item.description}</div>
            </div>
        }

    </div>
)

export const Picture = (props: TypeProps) => {
    const title = props.showText
        ? (props.isSelect ? getName("Picture") : getName("PictureText") +":")
        : '';
    return (<div className="key"> <PictureIcon />{title} </div>);
};

export const PictureIcon = () => {
    return (<i className="fa fa-image icon_color"></i>);
};

export const Description = () => (
    <div className="key">{getName('Description')}: </div>
);

const StepItemControls = (props: StepItemProps) => {
    const icon_colorDown = props.index < props.count - 1 ? "icon_color" : "icon_color_disabled";
    const icon_colorUp = props.index > 0 ? "icon_color" : "icon_color_disabled";
    const titleDown = props.index < props.count - 1 ? getName('MoveStepItemDown') : '';
    const titleUp = props.index > 0 ? getName('MoveStepItemUp') : '';
    return (
        <div>
            <span title={titleUp} onClick={event => props.moveStepItem(props.index, true)}>
                <i className={`fa fa-arrow-up ${icon_colorUp} icon_link`} aria-hidden="true"></i>
            </span>
            <span title={titleDown} onClick={event => props.moveStepItem(props.index, false)}>
                <i className={`fa fa-arrow-down ${icon_colorDown} icon_link`} aria-hidden="true"></i>
            </span>
            <span title={getName("EditStepItem")} onClick={event => props.editStepItem(props.index)}>
                <i className="fa fa-pencil-square-o icon_color icon_link" aria-hidden="true"></i>
            </span>
            <span title={getName("RemoveStepItem")} onClick={event => props.removeStepItem(props.index)}>
                <i className="fa fa-minus-circle icon_color_red icon_link" aria-hidden="true"></i>
            </span>
            {/*
            <span title="Show Step Item Menu" >
                <i className="fa fa-bars" aria-hidden="true"></i>
            </span>
            */}
        </div>
    );
};

const SetStepPosition = () => {
    const stepsContextValue: StepsContextValue = useContext<StepsContextValue>(StepsContext);
    const [position, setPosition] = useState<number>(stepsContextValue.currentStepNumber + 1);
    const inputRef = createRef<HTMLInputElement>();

    useEffect(() => {
        setPosition(stepsContextValue.currentStepNumber + 1);
    }, [stepsContextValue.currentStepNumber]);

    const onChange = (target: any) => {
        setPosition(target.value);
    }
    
    const count = stepsContextValue.stepsCount;
    return (
        <span className={count === 0 ? "link disabled_link" : "link"}>
            <span onClick={() => stepsContextValue.setStepPosition(position)}>
                {getName("SetStepPosition")}
            </span>
            {(count > 0) && <input type="number" className="step_number" max={count} min="1" value={position}
                onChange={event => onChange(event.target)} ref={inputRef} onScroll={event => {inputRef.current?.blur(); }}/>
            }
        </span>
    );
}

