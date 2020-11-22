import React from 'react';
import "./paging.css";

import { getName } from '../../../Common/methods';

export interface PagingProps {
    count: number;
    current: number;
    onPagingClick: (newCurrentStaep: number) => void;
};

const Paging = (props: PagingProps) => {

    const pagingClick = (name: string) => {
        let newValue = props.current;
        switch (name) {
            case 'back': if (props.count > 0 && props.current > 0) {
                    newValue = props.current - 1;
                }
                break;
            case 'back_end': newValue = 0;
                break;
            case 'forvard': if (props.count > 0 && props.current < props.count - 1) {
                    newValue = props.current + 1;
                }
                break;
            case 'forvard_end': if (props.count > 0) {
                    newValue = props.count - 1;
                }
                break;
        }
        props.onPagingClick(newValue);
    }

    const disable_back = props.current === 0;
    const disable_forvard = !(props.current < props.count - 1);
    const class_back: string = disable_back ? 'button_paging button_disabled button_back' : 'button_paging button_back';
    const class_forvard: string = disable_forvard ? 'button_paging button_disabled button_forvard' : 'button_paging button_forvard';
        return (
            <div className="paging">
                <button className={class_back} disabled={disable_back} onClick={event => pagingClick('back_end')}> {'<<'} </button>
                <button className={class_back} disabled={disable_back} onClick={event => pagingClick('back')}> {'<'} </button>
                <span>&nbsp; {getName("GoToStep")} &nbsp;</span>
                <button className={class_forvard} disabled={disable_forvard} onClick={event => pagingClick('forvard')}> {'>'} </button>
                <button className={class_forvard} disabled={disable_forvard} onClick={event => pagingClick('forvard_end')}> {'>>'} </button>

            </div>
        );
};
export default Paging;
