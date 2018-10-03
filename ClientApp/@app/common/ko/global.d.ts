declare interface KnockoutStatic {
    observableDate: KnockoutObservableDateStatic
    observableTime: KnockoutObservableTimeStatic
    observableClock: KnockoutObservableClockStatic
    observableNumber: KnockoutObservableNumberStatic
    observableString: KnockoutObservableStringStatic
}

declare interface KnockoutObservableTime extends KnockoutObservable<number | undefined> {
    toString: () => string;
    /** Check subscribe has error or not */
    hasError?: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError?: () => void;
    /** Method check subscribe has error or not */
    checkError?: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage?: KnockoutObservable<string>;
}

declare interface KnockoutObservableClock extends KnockoutObservable<number | undefined> {
    toString: () => string;
    /** Check subscribe has error or not */
    hasError?: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError?: () => void;
    /** Method check subscribe has error or not */
    checkError?: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage?: KnockoutObservable<string>;
}

declare interface KnockoutObservableDate extends KnockoutObservable<Date | undefined> {
    toString: (format: string) => string;
    /** Check subscribe has error or not */
    hasError?: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError?: () => void;
    /** Method check subscribe has error or not */
    checkError?: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage?: KnockoutObservable<string>;
}

declare interface KnockoutObservableNumber extends KnockoutObservable<number | undefined> {
    toLocateString: () => string;
    toCurrencyString: () => string;
    /** Check subscribe has error or not */
    hasError?: KnockoutObservable<boolean>;
    /** Method clear error of subscibe */
    clearError?: () => void;
    /** Method check subscribe has error or not */
    checkError?: (value?: any) => void;
    /** Error message of subscibe on view */
    validationMessage?: KnockoutObservable<string>;
}

declare interface KnockoutObservableString extends KnockoutObservable<string | undefined> {

}

declare interface KnockoutObservableDateStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = Date>(value: T): KnockoutObservableDate;
    <T = Date>(value: null): KnockoutObservableDate;
    <T = Date>(): KnockoutObservableDate;
}

declare interface KnockoutObservableTimeStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = number>(value: T): KnockoutObservableTime;
    <T = number>(value: null): KnockoutObservableTime;
    <T = number>(): KnockoutObservableTime;
}

declare interface KnockoutObservableClockStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = number>(value: T): KnockoutObservableClock;
    <T = number>(value: null): KnockoutObservableClock;
    <T = number>(): KnockoutObservableClock;
}

declare interface KnockoutObservableNumberStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = number>(value: T): KnockoutObservableNumber;
    <T = number>(value: null): KnockoutObservableNumber;
    <T = number>(): KnockoutObservableNumber;
}

declare interface KnockoutObservableStringStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = string>(value: T): KnockoutObservableString;
    <T = string>(value: null): KnockoutObservableString;
    <T = string>(): KnockoutObservableString;
}