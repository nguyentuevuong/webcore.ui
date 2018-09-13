declare interface InputObservable<T> extends ValidationObservable<T> {

}

declare interface KnockoutBindingHandlers {
    i18n: KnockoutBindingHandler;
    label: KnockoutBindingHandler;
}

declare interface KnockoutComponents {
}

declare interface JQuery<TElement = HTMLElement> {
    modal: (value: any) => JQuery<TElement>
}