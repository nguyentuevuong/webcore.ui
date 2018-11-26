declare interface Array<T> {
    find(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): T;
}