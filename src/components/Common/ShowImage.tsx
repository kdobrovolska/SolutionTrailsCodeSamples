import React from 'react';
interface ShowImageProps {
    imageUrl: string;
    size: number;
    unit: string;
    marginRight: boolean;
}

export const ShowImage = (props: ShowImageProps) => {
    const getStyle = () => {
        const str: string = props.size + props.unit;
        return {
            width: props.imageUrl?.length ? 'auto' : str,
            height: props.imageUrl?.length ? 'auto' : str,
            maxWidth: str,
            maxHeight: str,
        }
    }
    const classImage: string = props.marginRight ? "image_holder margin_right" : "image_holder";
    return (
        <span>
            {props.marginRight && <img className={classImage} data-777="" src={props.imageUrl} style={getStyle()} alt=''/>}
            {!props.marginRight && <img className={classImage} src={props.imageUrl} style={getStyle()} alt=''/>}
        </span>
    );
}