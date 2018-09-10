declare interface KnockoutObservable<T> {
    $name?: KnockoutObservable<string>;
    $focus?: KnockoutObservable<boolean>;
    hasError?: KnockoutObservable<boolean>;
    clearError?: () => void;
    checkError?: () => void;
    validationMessage?: KnockoutObservable<string>;
}

declare interface ValidationObservable<T> extends KnockoutObservable<T> {
    hasSubscriptionsForEvent: (subscribe: any) => boolean;
    addError: (rule: string, message: string) => void;
    removeError: (rule: string) => void;
    addValidate: (key: string, subscribe: any) => void;
    removeValidate: (key: string) => void;
    validationSubscribes: ISubscribeValidates;
    validationMessages: KnockoutObservable<IMessages>;
}

declare interface IRule {
    [key: string]: any | boolean;
}

declare interface IMessages {
    [key: string]: string;
}

declare interface ISubscribeValidates {
    [key: string]: any;
}