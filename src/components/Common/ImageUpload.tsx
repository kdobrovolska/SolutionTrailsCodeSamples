import React, { ChangeEvent } from 'react';

import { ShowImage } from './ShowImage';

export interface ImageData {
    imageFile: File | null | undefined;
    imageUrl: string;
}

interface ImageUploadProps{
    onChange: (imageData: ImageData) => void;
    imageUrl: string;
};

const ImageUpload = (props: ImageUploadProps) => {
    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        let reader = new FileReader();
        let file = event.target.files![0];


        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const res = reader.result as string;
            // TODO: check image dimentions
            //var img = new Image();
            //img.onload = () => {
            //};
            //img.src = res;
            props.onChange({
                imageFile: file,
                imageUrl: res,
            });
        };
    }

    


    return (<div className="left_top_left">
        <div className="panel_row">
            {/*TODO: use div with background-image instead of img*/}
            <ShowImage imageUrl={props.imageUrl} size={120} unit="px" marginRight={false}/>
        </div>

        <div className="panel_row">
            {/*TODO: use a nice button instead of common file input */}
            {/*<button className="image_button" onChange={props.onImageChange}>Choose a file... </button>*/}
            <input className="image_button" onChange={onImageChange} type="file" accept="image/jpeg,image/png,image/gif"/>
        </div>
    </div>);

};

export default ImageUpload;
