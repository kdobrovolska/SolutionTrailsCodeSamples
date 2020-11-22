export type FormState<T> = { [K in keyof T]: T[K] };
