declare interface KnockoutStatic {
    observableDate: KnockoutObservableDate<Date | undefined | null>;
    observableTime: KnockoutObservableTime<number | undefined | null>;
    observableClock: KnockoutObservableClock<number | undefined | null>;
    observableNumber: KnockoutObservableNumber<number | undefined | null>;
    observableString: KnockoutObservableString<string | undefined | null>;
}

declare interface KnockoutObservableTime<T> extends KnockoutObservableStatic {
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

declare interface KnockoutObservableClock<T> extends KnockoutObservableStatic {
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

declare interface KnockoutObservableDate<T> extends KnockoutObservableStatic {
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

declare interface KnockoutObservableNumber<T> extends KnockoutObservableStatic {
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

declare interface KnockoutObservableString<T> extends KnockoutObservableStatic {

}