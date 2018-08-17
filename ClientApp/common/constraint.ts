export interface INumberConstraint {
    type: TypeOfNumber;
    min?: number;
    max?: number;
    precision?: number;
    scale?: number;
}

export interface IStringConstraint {
    type: TypeOfString;
    minLength?: number;
    maxLength?: number;
}

export enum TypeOfConstraint {
    TEXT = 1,
    NUMBER = 2,
    DATE = 3,
    LIST = 4,
    DROPDOWN = 5,
    BUTTON = 6
}

export enum TypeOfString {
    ASCII = 1,
    UNICODE = 2,
    JP = 3
}

export enum TypeOfNumber {
    INT = 1,
    DECIMAL = 2
}