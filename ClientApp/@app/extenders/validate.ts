import { ko } from '@app/providers';

export function extend(target: IValidateExtenders) {
    ko.utils.extend(target, {
        hasError: target.hasError || ko.observable(false),
        clearError: target.clearError || function () { target.hasError(false); target.validationMessage(''); },
        validationMessage: target.validationMessage || ko.observable('')
    });
}

export interface IValidateExtenders {
    hasError: KnockoutObservable<boolean>;
    clearError: () => void;
    validationMessage: KnockoutObservable<string>;
}