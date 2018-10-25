import { ko } from '@app/providers';

export const lang: KnockoutObservable<string> = ko.observableOrig(localStorage.getItem('lang') || 'en');

ko.computed({
    read: () => {
        localStorage.setItem('lang', ko.toJS(lang));
    }
});