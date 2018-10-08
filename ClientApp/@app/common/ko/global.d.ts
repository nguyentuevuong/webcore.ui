declare interface KnockoutStatic {
    // Extender observable (has some extend)
    observable: KnockoutObservableStatic;
    // Original observable
    observableOrg: KnockoutObservableStatic;
    observableDate: KnockoutObservableDateStatic;
    observableTime: KnockoutObservableTimeStatic;
    observableClock: KnockoutObservableClockStatic;
    observableNumber: KnockoutObservableNumberStatic;
    observableString: KnockoutObservableStringStatic;
    observableSelection: KnockoutObservableSelectionStatic;
}

declare interface KnockoutObservableTime extends KnockoutObservable<number | undefined> {
    toString: () => string;
    /** Check subscribe has error or not */
    hasError: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError: () => void;
    /** Method check subscribe has error or not */
    checkError: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage: KnockoutObservable<string>;
}

declare interface KnockoutObservableClock extends KnockoutObservable<number | undefined> {
    toString: () => string;
    /** Check subscribe has error or not */
    hasError: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError: () => void;
    /** Method check subscribe has error or not */
    checkError: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage: KnockoutObservable<string>;
}

declare interface KnockoutObservableDate extends KnockoutObservable<Date | undefined> {
    toString: (format: string) => string;
    /** Check subscribe has error or not */
    hasError: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError: () => void;
    /** Method check subscribe has error or not */
    checkError: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage: KnockoutObservable<string>;
}

declare interface KnockoutObservableNumber extends KnockoutObservable<number | undefined> {
    toLocateString: () => string;
    toCurrencyString: () => string;
    /** Check subscribe has error or not */
    hasError: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError: () => void;
    /** Method check subscribe has error or not */
    checkError: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage: KnockoutObservable<string>;
}

declare interface KnockoutObservableString extends KnockoutObservable<string | undefined> {
    /** Check subscribe has error or not */
    hasError: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError: () => void;
    /** Method check subscribe has error or not */
    checkError: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage: KnockoutObservable<string>;
}

declare interface KnockoutObservableSelection extends KnockoutObservable<any | undefined> {
    /** Check subscribe has error or not */
    hasError: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError: () => void;
    /** Method check subscribe has error or not */
    checkError: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage: KnockoutObservable<string>;
}

declare interface KnockoutObservableDateStatic {
    fn: KnockoutObservableFunctions<Date>;

    <T = Date>(value: T): KnockoutObservableDate;
    <T = Date>(value: null): KnockoutObservableDate;
    <T = Date>(): KnockoutObservableDate;
}

declare interface KnockoutObservableTimeStatic {
    fn: KnockoutObservableFunctions<number>;

    <T = number>(value: T): KnockoutObservableTime;
    <T = number>(value: null): KnockoutObservableTime;
    <T = number>(): KnockoutObservableTime;
}

declare interface KnockoutObservableClockStatic {
    fn: KnockoutObservableFunctions<number>;

    <T = number>(value: T): KnockoutObservableClock;
    <T = number>(value: null): KnockoutObservableClock;
    <T = number>(): KnockoutObservableClock;
}

declare interface KnockoutObservableNumberStatic {
    fn: KnockoutObservableFunctions<number>;

    <T = number>(value: T): KnockoutObservableNumber;
    <T = number>(value: null): KnockoutObservableNumber;
    <T = number>(): KnockoutObservableNumber;
}

declare interface KnockoutObservableStringStatic {
    fn: KnockoutObservableFunctions<string>;

    <T = string>(value: T): KnockoutObservableString;
    <T = string>(value: null): KnockoutObservableString;
    <T = string>(): KnockoutObservableString;
}

declare interface KnockoutObservableSelectionStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = any>(value: T): KnockoutObservableSelection;
    <T = any>(value: null): KnockoutObservableSelection;
    <T = any>(): KnockoutObservableSelection;
}

declare interface KnockoutObservableStatic {
    org: boolean;
}

declare interface KnockoutUtils {
    setPrototypeOfOrExtend: (obj: KnockoutObservable<any>, proto: any) => KnockoutObservable<any>;
}

declare interface KnockoutSubscribableFunctions<T> {
    init: (instance: KnockoutObservable<any>) => void;
    extend: (requestedExtenders: any) => void;
}