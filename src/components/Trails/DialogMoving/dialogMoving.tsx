import React, { useState, useEffect, useRef, MouseEvent, ReactNode } from 'react';
import './dialogMoving.css';
import { getName } from '../../../Common/methods';

interface DialogProps {
    cancel?: () => void;
    ok?: () => void;
    width?: number;
    minWidth?: number;
    minHeight?: number;
    height?: number;
    title: string;
    resizeWidthOnly?: boolean; 
    isOkDisabled?: boolean;
    isYesNo?: boolean;
    children: ReactNode;
}
interface DialogState {
    left: number;
    top: number;
    width: number ;
    dX: number;
    dY: number;
}


export const DialogMoving = (props: DialogProps) => {
    const [dialogState, setDialogState] = useState<DialogState>(() => {
        const w = props.width ? props.width : window.innerWidth / 2;
        const h = props.height ? props.height : window.innerHeight / 2;
        return {
            left: (window.innerWidth - w) / 2,
            top: (window.innerHeight >= 500 && window.innerWidth > 400) ? (window.innerHeight - h) / 2 : 10,
            width: Math.min(w, window.innerWidth - 10),
            dX: -1,
            dY: -1,
        };
    });
    const start = useRef<boolean>(false);

    useEffect(() => {
        window.addEventListener("mouseup",onMouseUp);
        window.addEventListener("mousemove", onMouseMove);
        
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);

        }
    }, []);

    //useEffect(() => {
    //    console.log('start=', start.current);
    //}, [start.current]);

     
    const onMouseUp = (event: globalThis.MouseEvent) => {
        event.preventDefault();
        console.log('onMouseUp,' + start.current);
        if (start.current === true)
        {
            let x = Math.max(0, event.clientX);
            x = Math.min(x, window.innerWidth - 20);
            let y = Math.max(0, event.clientY - 20);
            y = Math.min(y, window.innerHeight);
            setDialogState(prev => ({
                ...prev,
                left: prev.dX + x,
                top: prev.dY + y,
            }));
            start.current = false;
        } 
    }

    const onMouseMove = (event: globalThis.MouseEvent) => {
        event.preventDefault();
        console.log('onMouseMove,' + start.current);
        if (start.current === true)
        {
            const x = event.clientX;
            const y = event.clientY;
            setDialogState(prev => ({
                ...prev,
                left: prev.dX + x,
                top: prev.dY + y,
            }));
        };

    }

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;
        setDialogState(prev => ({
            ...prev,
            dX: prev.left -x,
            dY: prev.top - y,
        }));
        start.current = true;
    }

    const okClassName =props.isOkDisabled ? "button_mooving link disabled_link" : "button_mooving link";
    const base = {
        left: dialogState.left + 'px',
        top: dialogState.top + 'px',
        minWidth: props.minWidth ? props.minWidth : 100 + 'px',
        minHeight: props.minHeight ? + props.minHeight : 100 + 'px',
        width: dialogState.width + 'px',
    }
    const style = props.height
        ? {
            ...base,
            height: props.height + 'px',
        }
        : {
            ...base,
        };
        
    return (
        <div className="main_mooving_dialog">
            <div className={props.resizeWidthOnly ? "win hor_resize": "win"} style={style} >
                <div className="header" onMouseDown={onMouseDown}> 
                    {props.title}
                </div>
                <div className="panel_dialog_mooving">
                    {!!props.children && props.children}
                </div>
                <div className="footer_mooving">
                    <div className="footer_inner">
                        {props.ok && <button onClick={props.ok} className={okClassName} disabled={props.isOkDisabled}>
                                {getName(props.isYesNo ? 'Yes' : 'OK')}
                            </button>
                        }
                        {props.cancel &&  <button onClick={props.cancel} className={"button_mooving link"}>
                            {getName(props.isYesNo ? 'No' : 'Cancel')}
                        </button>}
                    </div>
                </div>
            </div>
        </div>
        );
}

interface DialogInActiveProps {
    onClose: () => void,
}

export const DialogInActive = (props: DialogInActiveProps) => (
    <DialogMoving
        ok={props.onClose}
        title="Information:" width={350} height={150}
    >
        <div className="dialog_question">{getName('YouAreCurrently')}</div>
        <div className="dialog_info"> {getName('PleaseContact')} </div>
    </DialogMoving>
)