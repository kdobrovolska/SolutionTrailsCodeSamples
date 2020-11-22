import React, { ChangeEvent } from 'react';
import ImageUpload, { ImageData } from '../../Common/ImageUpload';


import '../trails.css'
import '../steps.css'
import '../common.css'

import { BaseTrailInterface } from "../../../Common/interfaces";
import { getShowTime } from "../../../Common/methods";
import { getName } from '../../../Common/methods';



interface PanelInterface extends BaseTrailInterface {
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onChangeCheckbox: (event: any) => void;
}

interface LeftPanelInterface extends PanelInterface {
    onImageChange: (data: ImageData) => void;
}

interface MainPanelInterface extends PanelInterface {
    onClick: () => void;
    isSaveDisabled: boolean;
}
const LeftTopPanel = (props: LeftPanelInterface) => {
    return (
        <div>
            <div className="contaner_row_left_top_panel ">
                <ImageUpload imageUrl={props.image} onChange={props.onImageChange} />

                <div className="left_top_right">
                    <div className="panel_row row_narrow">
                        <label className="asterix">*</label>
                        <span className="label_left_panel">{getName('TrailTitle')}</span>
                    </div>
                    <div className="panel_row row_narrow">
                        <input className="item_top_left" placeholder={getName('TrailTitle')} type="text" name="title" value={props.title} onChange={props.onChange} />
                    </div>

                    <div className="panel_row row_narrow">
                        <label className="asterix">*</label>
                        <span className="label_left_panel">{getName('ShortDescription')}</span>
                    </div>
                    <div className="panel_row row_narrow">
                        <textarea className="textarea_short item_top_left" placeholder={getName('ShortDescription')} name="shortdescription" value={props.shortdescription} onChange={props.onChange} />
                    </div>


                </div>
            </div>
        </div>
    );
};

export const LeftPanel = (props: LeftPanelInterface) => (
    <div className="main_left_right">
        <div className="contaner_column">
            <div className="left_top">
                <LeftTopPanel {...props} onImageChange={props.onImageChange} />
            </div>
            <Description {...props} />
            <LocationCity {...props} />
        </div>
    </div>
);
const Description = (props: LeftPanelInterface) => (
    <div className="panel_row ">
        <div className="description_item">
            <div className="panel_row row_narrow">
                <span className="label_left_panel">{getName('Description')}</span>
            </div>
            <div className="panel_row row_narrow">
                <textarea className="textarea_left_panel item_left" placeholder={getName('Description')}
                    name="description" value={props.description} onChange={props.onChange} />
            </div>
        </div>
    </div>
);

const LocationCity = (props: LeftPanelInterface) => (
    <div className="panel_row container_change_direction">
        <div className="container_label_input_left">
            <div className="panel_row row_narrow">
                <span className="label_left_panel">{getName('Location')}</span>
            </div>
            <div className="panel_row row_narrow">
                <input className="item_left" placeholder={getName('Location')} type="text" name="location" value={props.location} onChange={props.onChange} />
            </div>
        </div>

        <div className="container_label_input_left">
            <div className="panel_row row_narrow">
                <span className="label_left_panel">{getName('City')}</span>
            </div>
            <div className="panel_row row_narrow">
                <input type="text" placeholder={getName('City')} className="textarea item_left" name="city" value={props.city} onChange={props.onChange} />
            </div>
        </div>
    </div>
);


export const RightPanel = (props: MainPanelInterface) => {
    //const isValid: boolean = !!(props.shortdescription.length && props.title.length);
    const titleArea = getName('titleArea');
    const titleSubject = getName('titleSubject');
    const titleCategory = getName('titleCategory');
    return (
        <div className="main_left_right">
            <div className="panel_row public_active">
                <div className="public_active_inner">
                    <span className="trail_right_label">{getName('Public')}</span>
                    <input type="checkbox" name="public" checked={props.public} className="trail_right_checkbox checkbox" onChange={props.onChangeCheckbox} />
                </div>
                <div className="public_active_inner">
                    <span className="trail_right_label">{getName('Active')}</span>
                    <input type="checkbox" name="active" checked={props.active} className="trail_right_checkbox checkbox" onChange={props.onChangeCheckbox} />
                </div>
            </div>
            <div className="right_panel_row container_change_direction">
                <div className="container_label_input_right">
                    <div className="trail_right_label"
                        title={titleArea}
                    >{getName('Area')}</div>
                    <input type="text" name="area" placeholder={getName('Area')} className="trail_right_input" value={props.area} onChange={props.onChange} />
                </div>
                <div className="container_label_input_right">
                    <span className="trail_right_label"
                        title={titleSubject}
                    >{getName('Subject')}</span>
                    <input type="text" name="subject" value={props.subject} placeholder={getName('Subject')} className="trail_right_input" onChange={props.onChange} />
                </div>
            </div>
            <div className="right_panel_row container_change_direction">
                <div className="container_label_input_right">
                    <span className="trail_right_label" title={titleCategory}>{getName('Category')}</span>
                    <input type="text" name="category" value={props.category} placeholder={getName('Category')} className="trail_right_input"
                        onChange={props.onChange} />
                </div>
                <div className="container_label_input_right hide">
                    <span className="trail_right_label">&nbsp;&nbsp;</span>
                </div>
            </div>
            <div className="trail_right_hr">
                <hr />
            </div>
            <div className="right_panel_row">
                <div className="panel_row">
                    <span className="label_left_panel">{getName("CreatedAt")}: </span><span>{getShowTime(props.createdAt)} </span>
                </div>
            </div>
            <div className="right_panel_row">
                <div className="panel_row">
                    <span className="label_left_panel">{getName('LastEditedAt')}: </span><span>{getShowTime(props.editedAt)} </span>
                </div>
            </div>
            <button type="button" className={`trail_right_button link ${!props.isSaveDisabled ? '' : 'disabled_link'}`} onClick={props.onClick} disabled={props.isSaveDisabled}>{getName('Save')}</button>

        </div>
    )
};

