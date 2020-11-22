import React, { useState, useEffect, useContext} from 'react';
import '../common.css'
import '../dialog.css'
import '../addEditStepItem.css'

import { Question, Text, Picture, Description} from '../Steps/steps';
import { StepItemType, StepItem } from '../../../Common/interfaces';
import { DialogMoving } from "../DialogMoving/dialogMoving";
import ImageUpload, { ImageData } from "../../Common/ImageUpload";
import { getName } from '../../../Common/methods';
import { StepsContext, StepsContextValue } from '../StepsReducer';

export const AddEditStepItem = () => {
    const [stepItem, setStepItem] = useState<StepItem | undefined>(undefined);
    const [title, setTitle] = useState<string>('');
    const stepsContextValue: StepsContextValue = useContext<StepsContextValue>(StepsContext);
    

    useEffect(() => {
        if (stepsContextValue.currentStep
            && 0 <= stepsContextValue.showAddEditNumberStepItem
            && stepsContextValue.showAddEditNumberStepItem < stepsContextValue.currentStep.items.length) {
            setStepItem(stepsContextValue.currentStep.items[stepsContextValue.showAddEditNumberStepItem]);
            setTitle(getName("EditStepItem"));
        } else {
            setTitle(getName("AddStepItem"));
        }
    }, [stepsContextValue.currentStep, stepsContextValue.showAddEditNumberStepItem]);
    
    const onSelectTypeClick = (type: StepItemType) => {
        const stepItem: StepItem = {
            type,
            data: '',
            description: '',
            location: 'left',
            width: 100,
            minWidth: 200,
            image:'',
        };
        setStepItem(stepItem);
    }

    const onChange = (value: string, type: StepItemType | undefined) => {
        const stepItemCurrent: StepItem | undefined = stepItem ? { ...stepItem } : undefined;
        if (stepItemCurrent) {
            if (type) {
                stepItemCurrent.data = value;
            } else {
                stepItemCurrent.description = value;
            }
        }
        setStepItem(stepItemCurrent);
    }

    const onChangeDesign = (value: string, name: string) => {
        if (stepItem) {
            const stepItemCurrent = {
                ...stepItem,
                [name]: value,
            };
            setStepItem(stepItemCurrent);
        }
    }

    const onImageChanged = (data: ImageData) => {
        if (stepItem) {
            const stepItemCurrent = { ...stepItem };
            stepItemCurrent.image = data.imageUrl;
            if (data.imageFile) {
                stepItemCurrent.imageFile = data.imageFile;
            }
            setStepItem(stepItemCurrent);
        }
    }

   
    let color_panel = '';
    if (stepItem) {
        switch (stepItem.type) {
            case StepItemType.Question: color_panel = "panel_step_item_type question"; break;
            case StepItemType.Text: color_panel = "panel_step_item_type text"; break;
            case StepItemType.Picture: color_panel = "panel_step_item_type picture"; break;
        }
    }
    let isOkDisabled = true;
    if (stepItem) {
        if ((stepItem.type === StepItemType.Question || stepItem.type === StepItemType.Text)
                && stepItem.data.length > 0) {
                    isOkDisabled = false;
        }
        if (stepItem.type === StepItemType.Picture && stepItem.image.length) {
            isOkDisabled = false;
        }
    }
    const stepItemNumber = stepsContextValue.showAddEditNumberStepItem;
    return (
        <div>
            {!stepItem &&
                <DialogMoving width={Math.min(window.innerWidth -20, 400)} minWidth={300} height={200} minHeight={200}
                cancel={() => stepsContextValue.addEditStepItem(undefined, stepItemNumber)}
                    title={title}>
                        <div className="panel_select">
                            <div className="text_overflow">{getName('PleaseSelectItemType')}:</div>
                            <div className="select_type">
                                <div className="inner">
                                        <div onClick={event => onSelectTypeClick(StepItemType.Question)} className="select_item">
                                            <Question isSelect={true} showText={true}/>
                                        </div>
                                        <div onClick={event => onSelectTypeClick(StepItemType.Text)} className="select_item">
                                            <Text isSelect={true} showText={true}/>
                                        </div>
                                        <div onClick={event => onSelectTypeClick(StepItemType.Picture)} className="select_item">
                                            <Picture isSelect={true} showText={true}/>
                                        </div>
                                </div>

                            </div>
                        </div>
                </DialogMoving>
            }
            {stepItem &&
                <DialogMoving width={Math.min(window.innerWidth / 4 * 3, window.innerWidth - 20)} minWidth={200} minHeight={200}
                    ok={() => stepsContextValue.addEditStepItem(stepItem, stepItemNumber)}
                    cancel={() => stepsContextValue.addEditStepItem(undefined, stepItemNumber)}
                    title={title} resizeWidthOnly={true} isOkDisabled={isOkDisabled}>
                        <div className="panel_item">
                            {stepItem.type === StepItemType.Question && (
                                    <div className={color_panel}>
                                        <Question isSelect={false} showText={true}/>
                                            <textarea
                                                value={stepItem.data}
                                                placeholder={getName("question")}
                                                className="textarea_add_step_item"
                                                onChange={event => onChange(event.target.value, StepItemType.Question)}
                                            /> 
                                            <Description />
                                            <textarea
                                                value={stepItem.description}
                                                placeholder={getName("description")}
                                                className="textarea_add_step_item"
                                                onChange={event => onChange(event.target.value, undefined)}
                                            />
                                        </div>
                            )}
                            {stepItem.type === StepItemType.Text && (
                                <div className={color_panel}>
                                    <Text isSelect={false} showText={true}/>
                                    <textarea
                                        value={stepItem.data}
                                        placeholder={getName("text")}
                                        className="textarea_add_step_item"
                                        onChange={event => onChange(event.target.value, StepItemType.Text)}
                                    />
                                    <Description />
                                    <textarea
                                        value={stepItem.description}
                                        placeholder={getName("description")}
                                        className="textarea_add_step_item"
                                        onChange={event => onChange(event.target.value, undefined)}
                                    />
                                </div>
                            )}
                            {stepItem.type === StepItemType.Picture && (
                                <div className={color_panel}>
                                    <div className="container_picture">
                                        <div className="container_picture_text_description">
                                            <Picture isSelect={false} showText={true}/>
                                            <textarea
                                                value={stepItem.data}
                                                placeholder={getName("picture")}
                                                className="textarea_add_step_item"
                                                onChange={event => onChange(event.target.value, StepItemType.Picture)}
                                            />
                                            <Description />
                                            <textarea
                                                value={stepItem.description}
                                                placeholder={getName("description")}
                                                className="textarea_add_step_item"
                                                onChange={event => onChange(event.target.value, undefined)}
                                            />
                                        </div>
                                        <div >
                                            <ImageUpload imageUrl={stepItem.image ? stepItem.image : ''} onChange={onImageChanged} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="panel_design">
                                <span>
                            <label>{getName('Location')}:&nbsp;</label>
                                    <select value={stepItem.location} name='location'
                                        onChange={event => onChangeDesign(event.target.value, event.target.name)}>
                                        <option value="left">{getName('left')}</option>
                                        <option value="right">{getName('right')}</option>
                                        <option value="center">{getName('center')}</option>
                                        <option value="flow">{getName('flow')}</option>
                                    </select>
                                </span>
                                <span>
                            <label>{getName('Width')}:&nbsp;</label>
                                    <input type="number" min="10" max="100" name="width" value={stepItem.width}
                                        onChange={event => onChangeDesign(event.target.value, event.target.name)} />
                                </span>
                                <span>
                            <label>{getName('Min')}:&nbsp;</label>
                                    <input type="number" min="20" max="300" name="minWidth" value={stepItem.minWidth}
                                        onChange={event => onChangeDesign(event.target.value, event.target.name)} />
                                </span>
                            </div>
                        </div>
                </DialogMoving>
            }
        </div>
    );
}