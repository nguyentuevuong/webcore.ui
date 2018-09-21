declare interface KnockoutObservable<T> {
    /** Check subscribe has error or not */
    hasError?: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError?: () => void;
    /** Method check subscribe has error or not */
    checkError?: () => void;
    /** Error message of subscibe on view */
    validationMessage?: KnockoutObservable<string>;
}

declare interface ValidationObservable<T> extends KnockoutObservable<T> {
    /** Check observable has subscribe validation ? */
    hasSubscriptionsForValidation?: (subscribe: string) => boolean;
    /** Add error (with type) to validationMessages */
    addError?: (rule: string, message: string) => void;
    /** Remove error (with type) from validationMessages */
    removeError?: (rule: string) => void;
    /** Add validate (with type) to validationSubscribes */
    addValidate?: (key: string, subscribe: any) => void;
    /** Remove validate (with type) from validationSubscribes */
    removeValidate?: (key: string) => void;
    /** Repository of errors message  */
    validationMessages?: KnockoutObservable<IMessages>;
    $attr?: KnockoutObservable<{ [key: string]: KnockoutObservable<any> }>;
    $type?: KnockoutObservable<{ [key: string]: KnockoutObservable<any> }>;
    $id?: KnockoutObservable<string>;
    /** Name of control in view */
    $name?: KnockoutObservable<string>;
    /** Subscribe is focus or not in view */
    $focus?: KnockoutObservable<boolean>;
    /** Subscribe is require or not on view */
    $require?: KnockoutObservable<boolean>;
    $enable?: KnockoutObservable<boolean>;
    /** Subscribe is enable or disable on view */
    $disable?: KnockoutObservable<boolean>;
    $columns?: KnockoutObservableArray<string>;
    $raw?: KnockoutObservable<string>;
    $value?: KnockoutObservable<string>;
    $constraint?: KnockoutObservable<string>;
    $multiline?: KnockoutObservable<boolean>;
    regex?: KnockoutObservable<RegExp>;
    $width?: KnockoutObservable<number>;
    $icons?: KnockoutObservable<{ before: string, after: string }>;
}

declare interface KnockoutExtenders {
    $attr: (target: ValidationObservable<any>, attr: { [key: string]: any }) => ValidationObservable<any>;
    $name: (target: ValidationObservable<any>, name: string) => ValidationObservable<any>;
    $focus: (target: ValidationObservable<any>, focus: boolean) => ValidationObservable<any>;
    $enable: (target: ValidationObservable<any>, enable: boolean) => ValidationObservable<any>;
    $disbale: (target: ValidationObservable<any>, disbale: boolean) => ValidationObservable<any>;
    $required: (target: ValidationObservable<any>, required: any | boolean) => ValidationObservable<any>;
    $validate: (target: ValidationObservable<any>, validate: (value: any) => string) => ValidationObservable<any>;
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