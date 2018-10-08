import { ko } from '@app/providers';

export const lang: KnockoutObservable<string> = ko.observableOrig(localStorage.getItem('lang') || 'vi');

ko.computed({
    read: () => {
        localStorage.setItem('lang', ko.toJS(lang));
    }
});