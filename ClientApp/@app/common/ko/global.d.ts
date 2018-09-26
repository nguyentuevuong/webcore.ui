declare interface KnockoutStatic {
    observableDate: KnockoutObservableDate<Date | undefined | null>;
    observableTime: KnockoutObservableTime<number | undefined | null>;
    observableClock: KnockoutObservableClock<number | undefined | null>;
    observableNumber: KnockoutObservableNumber<number | undefined | null>;
    observableString: KnockoutObservableString<string | undefined | null>;
}

declare interface KnockoutObservableTime<T> extends KnockoutObservable<T> {
    toString: () => string;
}

declare interface KnockoutObservableClock<T> extends KnockoutObservable<T> {
    toString: () => string;
}

declare interface KnockoutObservableDate<T> extends KnockoutObservable<T> {
    toString: (format: string) => string;
}

declare interface KnockoutObservableNumber<T> extends KnockoutObservable<T> {
    toLocateString: () => string;
    toCurrencyString: () => string;
}

declare interface KnockoutObservableString<T> extends KnockoutObservable<T> {

}