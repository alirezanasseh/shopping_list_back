export interface ISGetMany<T> {
    list: Array<T>;
    count: number;
}

export interface ISGetOne<T> {
    item: T;
}

export interface ISAdded {
    id: string;
}

export interface ISResult {
    done: boolean;
}

export interface IServiceReturn<T> {
    code: number;
    result?: T;
    error?: string;
}