import { StepData, StepDataWithAnswers, StepItem, StepItemWithAnswer } from "./interfaces";
import { NamesEnglish } from './Localization/English';
import { NamesGerman } from './Localization/German';

const lang: string = 'English';
    //'German';

export const getStepDataWithAnswers = (step: StepData, answers?: Array<string>, isImportantData?: Array<boolean>): StepDataWithAnswers => {
    const stepDataWithAnswers: StepDataWithAnswers = {
        items: [],
    };
    step.items.forEach((item: StepItem, index: number) => {
        const itemwithAnswers: StepItemWithAnswer = {
            ...item,
            answer: !answers || !(index < answers.length)
                ? ''
                : answers[index],
            isImportant: !isImportantData || !(index < isImportantData.length)
                ? false
                : isImportantData[index],
        };
        stepDataWithAnswers.items.push(itemwithAnswers);
    });
    return stepDataWithAnswers;
};

export const getShowTime = (time: number | undefined): string => {
    if (time) {
        const date = new Date(time);
        return date.toDateString() + ' ' + date.toLocaleTimeString();
    }
    return '';
}

export const getName = (name: string): string => {
    return (lang === 'German') ? NamesGerman[name] : NamesEnglish[name];
}