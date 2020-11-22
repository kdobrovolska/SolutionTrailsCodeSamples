import React, { useReducer, Reducer, ReactNode } from 'react';

import { StepItem, StepData } from '../../Common/interfaces';

const ADD_STEP = 'addStep';
const REMOVE_STEP_REQUEST = 'removeStepRequest';
const REMOVE_STEP = 'removeStep';
const MOVE_STEP = 'moveStep';
const SET_STEP_POSITION = 'setStepposition';
const ADD_STEP_ITEM_REQUEST = 'addStepItemRequest';
const EDIT_STEP_ITEM_REQUEST = 'editStepItemRequest'
const ADD_EDIT_STEP_ITEM = 'addEditStepItem;'
const REMOVE_STEP_ITEM_REQUEST = 'removeStepItemRequest';
const REMOVE_STEP_ITEM = 'removeStepItem';
const MOVE_STEP_ITEM = 'moveStepItem';
const SET_CURRENT_STEP = 'setCurrentStep';
const SET_STEPS = 'setSteps';
const HIDE_SHOW_REMOVE_STEP_DIALOG = 'hideShowRemoveStepDialog';
const HIDE_SHOW_REMOVE_STEP_ITEM_DIALOG = 'hideShowRemoveStepItemDialog';
const CLEAR_STATE = 'clearState';
const CLEAR_ISCHANGED = 'clearIsChangedAfterSaving';

interface StateData {
    steps: Array<StepData>;
    currentStepNumber: number;
    showRemoveStepDialog: boolean;
    showAddEditStepItem: boolean;
    showAddEditNumberStepItem: number;
    showRemoveStepItemDialog: number;
    isChanged: boolean;
}

const initStateData: StateData = {
    steps: [],
    currentStepNumber: 0,
    showRemoveStepDialog: false,
    showAddEditStepItem: false,
    showAddEditNumberStepItem: -1,
    showRemoveStepItemDialog: -1,
    isChanged: false,
}

interface ActionBase {
    type: string;
    text?: string;
    flag?: boolean;
    num?: number;
    stepItem?: StepItem;
    steps?: Array<StepData>;
}

const addStepAction: (() => ActionBase) = () => ({ type: ADD_STEP });
const removeStepRequestAction: (() => ActionBase) = () => ({ type: REMOVE_STEP_REQUEST });
const removeStepAction: (() => ActionBase) = () => ({ type: REMOVE_STEP });
const moveStepAction: ((flag: boolean) => ActionBase) = (flag: boolean) => ({ type: MOVE_STEP, flag });
const setStepPositionAction: ((num: number) => ActionBase) = (num: number) => ({ type: SET_STEP_POSITION, num });
const addStepItemRequestAction: (() => ActionBase) = () => ({ type: ADD_STEP_ITEM_REQUEST });
const editStepItemRequestAction: ((stepItemNumber: number) => ActionBase) = (stepItemNumber: number) => ({
    type: EDIT_STEP_ITEM_REQUEST,
    num: stepItemNumber,
});
const addEditStepItemAction: ((stepItem: StepItem | undefined, stepItemNumber: number) => ActionBase) =
    (stepItem: StepItem | undefined, stepItemNumber: number) => ({
        type: ADD_EDIT_STEP_ITEM,
        stepItem,
        num: stepItemNumber,
    });
const removeStepItemRequestAction: ((stepItemNumber: number) => ActionBase) = (stepItemNumber: number) => ({
    type: REMOVE_STEP_ITEM_REQUEST,
    num: stepItemNumber,
})
const removeStepItemAction: (() => ActionBase) = () => ({type: REMOVE_STEP_ITEM})
const moveStepItemAction: ((num: number, flag: boolean) => ActionBase) = (num: number, flag: boolean) => ({
    type: MOVE_STEP_ITEM,
    flag,
    num,
});
const setCurrentStepAction: ((num: number) => ActionBase) = (num: number) => ({ type: SET_CURRENT_STEP, num});
const setStepsAction: ((steps: Array<StepData>) => ActionBase) = (steps: Array<StepData>) => ({
    type: SET_STEPS,
    steps,
});
const hideShowRemoveStepDialogAction: (() => ActionBase) = () => ({
    type: HIDE_SHOW_REMOVE_STEP_DIALOG,
});
const hideShowRemoveStepItemDialogAction: (() => ActionBase) = () => ({
    type:HIDE_SHOW_REMOVE_STEP_ITEM_DIALOG,
});
const clearStateAction: (() => ActionBase) = () => ({
    type: CLEAR_STATE,
});
const clearIsChangedAction: (() => ActionBase) = () => ({
    type: CLEAR_ISCHANGED,
});



const reducer: Reducer<StateData, ActionBase> = (state: StateData , action: ActionBase) => {
    switch (action.type) {
        case ADD_STEP: {
            const steps = [...state.steps];
            const stepData: StepData = {
                items: [],
            };
            steps.push(stepData);
            return {
                ...state,
                steps,
                currentStepNumber: steps.length - 1,
                isChanged: true,
            }
        }

        case REMOVE_STEP_REQUEST:
            return state.steps.length
                ? { ...state, showRemoveStepDialog: true }
                : state;

        case REMOVE_STEP: {
            const steps = [...state.steps];
            steps.splice(state.currentStepNumber, 1);
            return {
                ...state,
                steps,
                currentStepNumber: state.currentStepNumber < steps.length - 1
                    ? state.currentStepNumber + 1
                    : steps.length - 1,
                showRemoveStepDialog: false,
                isChanged: true,
            };
        }

        case MOVE_STEP: {
            const steps: Array<StepData> = [...state.steps];
            let currentStepNumber = state.currentStepNumber;
            if (action.flag && state.currentStepNumber > 0) {
                const step: StepData = { ...steps[state.currentStepNumber] };
                const stepBefore: StepData = { ...steps[state.currentStepNumber - 1] }
                steps[state.currentStepNumber - 1] = step;
                steps[state.currentStepNumber] = stepBefore;
                currentStepNumber--;
            }
            if (!action.flag && state.currentStepNumber < state.steps.length - 1) {
                const step: StepData = { ...steps[state.currentStepNumber] };
                const stepAfter: StepData = { ...steps[state.currentStepNumber + 1] }
                steps[state.currentStepNumber + 1] = step;
                steps[state.currentStepNumber] = stepAfter;
                currentStepNumber++;
            }
            return {
                ...state,
                steps,
                currentStepNumber,
                isChanged: true,
            };
        }

        case SET_STEP_POSITION:
            if (action.num !== undefined) {
                const pos = action.num - 1;
                if (!(pos >= 0 && pos < state.steps.length && pos !== state.currentStepNumber)) {
                    return state;
                }
                const steps: Array<StepData> = [...state.steps];
                const step: StepData = { ...steps[state.currentStepNumber] };
                const ar: Array<StepData> = new Array<StepData>();
                ar.push(step);
                steps.splice(state.currentStepNumber, 1);
                steps.splice(pos, 0, step);
                return {
                    ...state,
                    steps,
                    currentStepNumber: pos,
                    isChanged: true,
                };
            }
            return state;

        case ADD_STEP_ITEM_REQUEST:
            return {
                ...state,
                showAddEditStepItem: true,
                showAddEditNumberStepItem: -1,
            }
        case EDIT_STEP_ITEM_REQUEST:
            return {
                ...state,
                  showAddEditStepItem: true,
                showAddEditNumberStepItem: (action.num !== undefined) ? action.num: -1,
            }
        case ADD_EDIT_STEP_ITEM:
            if (!action.stepItem) {
                return {
                    ...state,
                    showAddEditStepItem: false,
                    showAddEditNumberStepItem: -1,
                }
            } else {
                const steps: Array<StepData> = [...state.steps];
                const step: StepData = { ...steps[state.currentStepNumber] };
                const stepItems: Array<StepItem> = [...step.items];
                if (action.num === undefined || action.num === -1) {
                    stepItems.push(action.stepItem);
                    step.items = stepItems;
                    steps[state.currentStepNumber] = step;
                    
                } else if (0 <= action.num && action.num < stepItems.length) {
                    stepItems[action.num] = { ...action.stepItem };
                    step.items = stepItems;
                    steps[state.currentStepNumber] = step;
                }
                return {
                    ...state,
                    steps,
                    showAddEditStepItem: false,
                    showAddEditNumberStepItem: -1,
                    isChanged: true,
                };
            }

        case REMOVE_STEP_ITEM_REQUEST:
            return {
                ...state,
                showRemoveStepItemDialog: (action.num !== undefined) ? action.num : -1,
            }

        case REMOVE_STEP_ITEM:   
            const index: number = state.showRemoveStepItemDialog;
            const steps: Array<StepData> = [...state.steps];
            const step: StepData = { ...steps[state.currentStepNumber] };
            const stepItems: Array<StepItem> = [...step.items];
            stepItems.splice(index, 1);
            step.items = stepItems;
            steps[state.currentStepNumber] = step;
            return {
                ...state,
                steps,
                showRemoveStepItemDialog: -1,
                isChanged: true,
            };

        case MOVE_STEP_ITEM: {
            const steps: Array<StepData> = [...state.steps];
            const step: StepData = { ...steps[state.currentStepNumber] };
            const stepItems: Array<StepItem> = [...step.items];
            if (action.num !== undefined) {
                if (action.flag && action.num > 0) {
                    const stepItemBefore = { ...stepItems[action.num - 1] };
                    const stepItem = { ...stepItems[action.num] };
                    stepItems[action.num - 1] = stepItem;
                    stepItems[action.num] = stepItemBefore;
                }
                if (!action.flag && action.num < stepItems.length - 1) {
                    const stepItemAfter = { ...stepItems[action.num + 1] };
                    const stepItem = { ...stepItems[action.num] };
                    stepItems[action.num + 1] = stepItem;
                    stepItems[action.num] = stepItemAfter;
                }
                step.items = stepItems;
                steps[state.currentStepNumber] = step;
                return {
                    ...state,
                    steps,
                    isChanged: true,
                };
            }
            return state;
        }

        case SET_CURRENT_STEP: {
            if (action.num !== undefined && 0 <= action.num && action.num < state.steps.length) {
                return {
                    ...state,
                    currentStepNumber: action.num,
                };
            }
            return state;
        }

        case SET_STEPS:
            return action.steps
                ? {
                    ...state,
                    steps: action.steps,
                    isChanged: false, // ????
                }
                : state;

        case HIDE_SHOW_REMOVE_STEP_DIALOG:
            return {
                ...state,
                showRemoveStepDialog: false,
            };

        case HIDE_SHOW_REMOVE_STEP_ITEM_DIALOG:
            return {
                ...state,
                showRemoveStepItemDialog: -1,
            }

        case CLEAR_STATE: 
            return initStateData;
        case CLEAR_ISCHANGED:
            return {
                ...state,
                isChanged: false,
            }

 
        default: return state;
    }
}
///---context

export interface StepsContextValue {
    steps: Array<StepData>;
    currentStepNumber: number;
    currentStep: StepData | undefined;
    stepsCount: number;
    isChanged: boolean;
    showRemoveStepDialog: boolean;
    showAddEditStepItem: boolean;
    showAddEditNumberStepItem: number;
    showRemoveStepItemDialog: number;
    clearState: () => void;
    addStep: () => void;
    removeStepRequest: () => void;
    removeStep: () => void;
    moveStep: (isUp: boolean) => void;
    setStepPosition: (num: number) => void;
    addStepItemRequest: () => void;
    editStepItemRequest: (num: number) => void,
    addEditStepItem: (stepItem: StepItem | undefined, stepItemNumber: number) => void;
    removeStepItemRequest: (stepItemNumber: number) => void;
    removeStepItem: () => void;
    moveStepItem: (num: number, isUp: boolean) => void;
    setCurrentStep: (num: number) => void;
    setSteps: (steps: Array<StepData>) => void;
    hideShowRemoveStepDialog: () => void;
    hideShowRemoveStepItemDialog: () => void;
    clearIsChanged: () => void;
}

const initContextValue: StepsContextValue = {
    steps: [],
    stepsCount: 0,
    currentStepNumber: 0,
    currentStep: undefined,
    isChanged: false,
    showRemoveStepDialog: false,
    showAddEditStepItem: false,
    showAddEditNumberStepItem: -1,
    showRemoveStepItemDialog: -1,
    clearState: () => {},
    addStep: () => { },
    removeStepRequest: () => { },
    removeStep: () => { },
    moveStep: (isUp: boolean) => { },
    setStepPosition: (num: number) => { },
    addStepItemRequest: () => { },
    editStepItemRequest: (num: number) => { },
    addEditStepItem: (stepItem: StepItem | undefined, stepItemNumber: number) => { },
    removeStepItemRequest: (stepItemNumber: number) => { },
    removeStepItem: () => { },
    moveStepItem: (num: number, isUp: boolean) => { },
    setCurrentStep: (num: number) => { },
    setSteps: (steps: Array<StepData>) => { },
    hideShowRemoveStepDialog: () => { },
    hideShowRemoveStepItemDialog: () => { },
    clearIsChanged: () => { },
};

export const StepsContext: React.Context<StepsContextValue>  = React.createContext<StepsContextValue>(initContextValue);

//export const useAlert = (): StepsContextValue => {
//    return useContext(AlertContext)
//}

interface StepsContextProviderProps {
    children: ReactNode;
};

export const StepsContextProvider = (props: StepsContextProviderProps) => {
    const [state, dispatch] = useReducer<Reducer<StateData, ActionBase>>(reducer, initStateData)

    const addStep = () => dispatch(addStepAction());
    const removeStepRequest = () => dispatch(removeStepRequestAction());
    const removeStep = () => dispatch(removeStepAction());
    const moveStep = (isUp: boolean) => dispatch(moveStepAction(isUp));
    const setStepPosition = (num: number) => dispatch(setStepPositionAction(num));
    const addStepItemRequest = () => dispatch(addStepItemRequestAction());
    const addEditStepItem = (stepItem: StepItem | undefined, stepItemNumber: number) =>
        dispatch(addEditStepItemAction(stepItem, stepItemNumber));
    const removeStepItemRequest = (stepItemNumber: number) =>
        dispatch(removeStepItemRequestAction(stepItemNumber));
    const removeStepItem = () => dispatch(removeStepItemAction());
    const editStepItemRequest = (num: number) => dispatch(editStepItemRequestAction(num));
    const moveStepItem = (num: number, isUp: boolean) => dispatch(moveStepItemAction(num, isUp));
    const setCurrentStep = (num: number) => dispatch(setCurrentStepAction(num));
    const setSteps = (steps: Array<StepData>) => dispatch(setStepsAction(steps));
    const hideShowRemoveStepDialog = () => dispatch(hideShowRemoveStepDialogAction());
    const hideShowRemoveStepItemDialog = () => dispatch(hideShowRemoveStepItemDialogAction());
    const clearState = () => dispatch(clearStateAction());
    const clearIsChanged = () => dispatch(clearIsChangedAction());

    return (
        <StepsContext.Provider value={{
            steps: state.steps,
            stepsCount: state.steps.length,
            currentStepNumber: state.currentStepNumber,
            currentStep: (state.steps.length > 0 && 0 <= state.currentStepNumber
                && state.currentStepNumber < state.steps.length) ? state.steps[state.currentStepNumber] : undefined,
            isChanged: state.isChanged,
            showAddEditStepItem: state.showAddEditStepItem,
            showAddEditNumberStepItem: state.showAddEditNumberStepItem,
            showRemoveStepDialog: state.showRemoveStepDialog,
            showRemoveStepItemDialog: state.showRemoveStepItemDialog,
            clearState,
            addStep,
            removeStepRequest,
            removeStep,
            moveStep,
            setStepPosition,
            addStepItemRequest,
            editStepItemRequest,
            addEditStepItem,
            removeStepItemRequest,
            removeStepItem,
            moveStepItem,
            setCurrentStep,
            setSteps,
            hideShowRemoveStepDialog,
            hideShowRemoveStepItemDialog,
            clearIsChanged,
        }}>
            {props.children}
        </StepsContext.Provider>
    )
}


