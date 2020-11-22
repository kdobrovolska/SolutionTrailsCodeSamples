import React from 'react';

import '../common.css'
import './showStep.css'

import { StepItem, StepItemType, StepItemWithAnswer, StepDataWithAnswers } from '../../../Common/interfaces';
import { TextIcon, QuestionIcon, PictureIcon, StarIcon } from '../Steps/steps';
import { ShowImage } from '../../Common/ShowImage';
import { getName } from '../../../Common/methods';

enum Position {
    right = 'right',
    left = 'left',
    center = 'center',
    flow = 'flow',
};
const PositionStyle: any = {
    right: 'flex-end',
    left: 'flex-start',
    center: 'center',
    flow: 'space-between',
};

export interface ShowStepProps {
    step: StepDataWithAnswers;
    isPreview: boolean;
    onAnswerChanged: (indexItem: number, answer: string) => void;
    onStarClick: (indexItem: number) => void;
}

interface ShowArrayItemsProps {
    ar: Array<StepItemIndex>;
    isPreview: boolean;
    useColor: boolean;
    onAnswerChanged: (indexItem: number, answer: string) => void;
    onStarClick: (indexItem: number) => void;
}

interface StepItemIndex {
    stepItem: StepItemWithAnswer;
    stepItemIndex: number;
}

export const ShowStep = (props: ShowStepProps) => {
  //  const [useColor, setUseColor] = useState<boolean>(false /*props.isPreview ? true : false*/);
    const items = props.step.items;
    const itemsArray: Array<Array<StepItemIndex>> = [];
    let ar: Array<StepItemIndex> = [];
    for (let i: number = 0; i < items.length; i++) {
        if (items[i].location !== Position.flow && ar.length > 0) {
            itemsArray.push(ar);
            ar = [];
        }
        ar.push({
            stepItem: items[i],
            stepItemIndex: i,
         });
        if (items[i].location !== Position.flow) {
            itemsArray.push(ar);
            ar = [];
        }
    }
    if (ar.length > 0) {
        itemsArray.push(ar);
    }
    return (
        <div className="show_step">
            {/*props.isPreview && <div className="use_color_container">
                    <span className="link" onClick={() => setUseColor(!useColor)}>{useColor ? 'Do not use color' : 'Use color'} </span>
                </div>
            */}
            <div className="items_container">
                {itemsArray.map((ar, indexAr) => (
                    <ShowArrayItems key={indexAr} ar={ar} isPreview={props.isPreview}
                        onAnswerChanged={props.onAnswerChanged} useColor={false} onStarClick={props.onStarClick}/>
                ))
                }
            </div>
        </div>
    );
}

const ShowArrayItems = (props: ShowArrayItemsProps) => {

    const buildStylePlace = (location: string) => {
        return {
            justifyContent: PositionStyle[location],
            alignItems: 'center',
        }
    };

    const buildStyle = (item: StepItem) => {
        return {
            width: item.width + '%',
            minWidth: item.minWidth + 'px',
        }
    };

    return (<div>
        {props.ar.length > 1 && <div className="item_place" style={buildStylePlace(Position.flow)}>
            {
                props.ar.map((item, index) => (
                    <div key={index} style={buildStyle(item.stepItem)}>
                        <ShowStepItem item={item.stepItem} isPreview={props.isPreview} indexItem={item.stepItemIndex}
                            onAnswerChanged={props.onAnswerChanged} useColor={props.useColor} onStarClick={props.onStarClick}/>
                    </div>
                ))
            }
        </div >
        }
        {props.ar.length === 1 && <div className="item_place" style={buildStylePlace(props.ar[0].stepItem.location)}>
            <div style={buildStyle(props.ar[0].stepItem)}>
                <ShowStepItem item={props.ar[0].stepItem} isPreview={props.isPreview} indexItem={props.ar[0].stepItemIndex}
                    onAnswerChanged={props.onAnswerChanged} useColor={props.useColor} onStarClick={props.onStarClick}/>
            </div>
        </div >
        }
    </div>
    );
}

export interface ShowStepItemProps {
    item: StepItemWithAnswer;
    indexItem: number;
    isPreview: boolean;
    useColor: boolean;
    onAnswerChanged: (indexItem: number, answer: string) => void;
    onStarClick: (indexItem: number) => void;
}

const ShowStepItem = (props: ShowStepItemProps) => {
    const data = props.item.data;
    const innerHtmlData = { __html: data };
    const innerHtmlDescription = { __html: props.item.description };

    let classes = "item_data";
    if (props.useColor) {
        if (props.item.type === StepItemType.Text)
            classes += " text";
        if (props.item.type === StepItemType.Question)
            classes += " question";
        if (props.item.type === StepItemType.Picture)
            classes += " picture";
    }

    return (<div className={props.useColor ? "item_border" : ""}>
        {props.item.type === StepItemType.Text && (
            <div className={classes}>
                <div>
                    <TextIcon />
                    <span className="item_data_text" dangerouslySetInnerHTML={innerHtmlData}/>
                </div>
                <div className="value description" dangerouslySetInnerHTML={innerHtmlDescription}/>
            </div>
        )}
        {props.item.type === StepItemType.Question && (
            <div className={classes}>
                <div>
                    <QuestionIcon />
                    <StarIcon
                        isItemImportant={props.item.isImportant}
                        onClick={() => props.onStarClick(props.indexItem)}
                        isPreview={props.isPreview}
                    />
                    <span className="key item_data_text" dangerouslySetInnerHTML={innerHtmlData}/>
                </div>
                <div className="value description" dangerouslySetInnerHTML={innerHtmlDescription} />
                <textarea
                    rows={7}
                    readOnly={props.isPreview}
                    placeholder={props.isPreview ? " " : getName("PleaseAnswerQuestion")}
                    className={props.isPreview ? "text_area_start_preview text_area_preview" : "text_area_start_preview" }
                    value={props.item.answer}
                    onChange={(event) => {props.onAnswerChanged(props.indexItem, event.target.value) }}
               />
                
            </div>
        )}
        {props.item.type === StepItemType.Picture && (
            <div className={classes}>
                <div>
                    <PictureIcon />
                    <span className="key item_data_text" dangerouslySetInnerHTML={innerHtmlData} />
                </div>
                {(props.item.image && props.item.image.length) && <div style={{ minHeight: 100 + '%' }}>
                    <ShowImage imageUrl={props.item.image} size={100} unit="%" marginRight={true}/>
                        <div className="value description" dangerouslySetInnerHTML={innerHtmlDescription} />
                    </div>
                }
            </div>
        )}
    </div>);
}

