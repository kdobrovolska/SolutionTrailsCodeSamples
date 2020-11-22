export interface BaseTrailInterface {
    title: string;
    shortdescription: string;
    public: boolean;
    active: boolean;
    area: string;
    subject: string;
    category: string;
    description: string;
    location: string;
    city: string;
    createdAt: number | undefined;
    editedAt: number | undefined;
    image: string;
    uidAuthor: string;
};

export interface TrailInterfaceEx extends BaseTrailInterface {
    uid: string;
    author: string;
}

export enum StepItemType {
    Question = 'Question',
    Picture = 'Picture',
    Text = 'Text',
};

export interface StepItem {
    type: StepItemType;
    data: string;
    description: string;
    location: string;
    width: number;
    minWidth: number;
    image: string;
    imageFile?: File;
}

export interface StepData {
    items: Array<StepItem>;
}

export interface StepItemWithAnswer extends StepItem {
    answer: string;
    isImportant: boolean;
}

export interface StepDataWithAnswers {
    items: Array<StepItemWithAnswer>;
}

export interface LogData {
    userId_trailId: string;
    userId: string;
    trailId: string;
    stepNumber: number;
    lastUpdate: number;
    isStepFinished: boolean | undefined;
    answers: Array<string>;
    isImportantData: Array<boolean>;
};

export interface StatisticLogData {
    trailId: string;
    trailTitle: string;
    authorId: string;
    userId: string;
    stepNumber: number;
    lastUpdate: number;
    stepsCount: number;
};

export interface StatisticLogDataWithUserNames extends StatisticLogData {
    authorUserName: string;
    userName: string;
};
export interface UserWithoutId {
    address: string;
    email: string;
    roles: { [key: string]: string | undefined };
    username: string;
    image: string;
    fullname: string;
};


export interface User extends UserWithoutId{
    uid: string;
};

export interface AuthUser extends User {
    emailVerified: boolean;
    providerData: any;
}

export interface UserThoughts {
    thought: string;
    lastUpdated: number;
}

export interface UserThoughtsData {
    data: Array<UserThoughts>;
}

export interface TrailFlags {
    isMyTrails: boolean;
    isMyRunningTrails: boolean;
}