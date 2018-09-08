declare interface KnockoutObservable<T> {
    hasError?: KnockoutObservable<boolean>;
    clearError?: () => void;
    validationMessage?: KnockoutObservable<string>;
}