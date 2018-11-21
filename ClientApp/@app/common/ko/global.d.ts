declare interface KnockoutStatic {
    bindingContext: KnockoutBindingContext;
    // Extender observable (has some extend)
    observable: KnockoutObservableStatic;
    // Original observable
    observableOrig: KnockoutObservableStatic;
    observableArrayOrig: KnockoutObservableArrayStatic;
    observableDate: KnockoutObservableDateStatic;
    observableTime: KnockoutObservableTimeStatic;
    observableClock: KnockoutObservableClockStatic;
    observableNumber: KnockoutObservableNumberStatic;
    observableString: KnockoutObservableStringStatic;
    observableBoolean: KnockoutObservableBooleanStatic;
    observableSelection: KnockoutObservableSelectionStatic;
    errors: KnockoutObservableError;
    clearError: () => void;
}

declare interface KnockoutObservable<T> {
    beforeValue: any;
}

declare interface KnockoutObservableTime extends KnockoutObservable<number | undefined> {
    toString: () => string;
}

declare interface KnockoutObservableClock extends KnockoutObservable<number | undefined> {
    toString: () => string;
}

declare interface KnockoutObservableDate extends KnockoutObservable<Date | undefined> {
    toString: (format: string) => string;
}

declare interface KnockoutObservableNumber extends KnockoutObservable<number | undefined> {
    toLocateString: () => string;
    toCurrencyString: () => string;
}

declare interface KnockoutObservableString extends KnockoutObservable<string | undefined> {
}

declare interface KnockoutObservableBoolean extends KnockoutObservable<boolean | undefined> {
}

declare interface KnockoutObservableSelection extends KnockoutObservable<any | undefined> {
    dataSources: KnockoutObservableArray<any>;
    extend(requestedExtenders: { [key: string]: any; }): KnockoutObservableSelection;
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

declare interface KnockoutObservableBooleanStatic {
    fn: KnockoutObservableFunctions<boolean>;

    <T = boolean>(value: T): KnockoutObservableBoolean;
    <T = boolean>(value: null): KnockoutObservableBoolean;
    <T = boolean>(): KnockoutObservableBoolean;
}

declare interface KnockoutBindingHandlers {
    i18n: KnockoutBindingHandler;
    label: KnockoutBindingHandler;
    init: KnockoutBindingHandler;
}

declare interface KnockoutObservableSelectionStatic {
    fn: KnockoutObservableFunctions<any>;

    <T = any>(value: T): KnockoutObservableSelection;
    <T = any>(value: null): KnockoutObservableSelection;
    <T = any>(): KnockoutObservableSelection;

    dataSources: KnockoutObservableArray<any>;
}

declare interface KnockoutObservableStatic {
    org: boolean;
}

declare interface KnockoutUtils {
    keys: (object: Array<any> | string | any | Function) => Array<string>;
    merge: (object: any, other: any) => any;
    has: (object: any, prop: string) => boolean;
    omit: (object: any, path: Array<string> | string) => any;
    set: (object: any, path: Array<string> | string, value: any) => any;
    get: (object: any, path: Array<string> | string | undefined, defaultVal?: any) => any;
    size: (object: Array<any> | string | any | Function) => number;
    isNull: (obj: any) => boolean;
    isEmpty: (object: any) => boolean;
    isArray: (object: any) => boolean;
    escape: (string: string) => string;
    unescape: (string: string) => string;
    setPrototypeOfOrExtend: (obj: KnockoutObservable<any>, proto: any) => KnockoutObservable<any>;
    extendBindingsAccessor: (accessor: () => any, prop: any) => any;
    extendAllBindingsAccessor: (accessor: KnockoutAllBindingsAccessor, prop: any) => KnockoutAllBindingsAccessor;
    removeEventHandler: (element: any, eventType: any, handler: Function) => void;
    registerOnceEventHandler: (element: HTMLElement, any: any, handler: Function) => void;
    dom: {
        create: (tag: string, options?: { [key: string]: string | number }) => HTMLElement;
        setAttr: (element: HTMLElement, key: string, value: string | number) => void;
        getAttr: (element: HTMLElement, key: string) => string;
        removeAttr: (element: HTMLElement, key: string) => void;
        hasClass: (element: HTMLElement, classCss: string) => boolean;
        addClass: (element: HTMLElement, classCss: string) => void;
        removeClass: (element: HTMLElement, classCss: string) => void;
        getScroll: (element: HTMLElement, side?: string) => number;
        parent: (element: HTMLElement) => HTMLElement;
        parents: (element: HTMLElement, helper: string) => HTMLElement;
    };
    date: {
        gmt: (year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number) => Date;
        utc: (year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, ms?: number) => Date;
        addDays: (date: Date, day: number) => Date;
        addMonths: (date: Date, month: number) => Date;
        addYears: (date: Date, year: number) => Date;
        addHours: (date: Date, hour: number) => Date;
        addMinutes: (date: Date, minute: number) => Date;
        addSeconds: (date: Date, second: number) => Date;
        from: (date: Number | string, format?: string) => Date;
        format: (date: Date, format?: string, utc?: boolean) => string;
        calendar: (month: number, year: number) => Array<Date>;
        dayNames: Array<string>;
        monthNames: Array<string>;
    };
}

declare interface KnockoutObservableError extends KnockoutObservableArray<KnockoutObservable<any>> {
    showDialog: KnockoutObservableBoolean;
}

declare interface KnockoutObservableRoute extends KnockoutObservableArray<any> {
    currentRoute: KnockoutObservable<any>;
}

declare interface KnockoutComponents {
}
