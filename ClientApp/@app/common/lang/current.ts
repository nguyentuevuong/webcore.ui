import { ko } from '@app/providers';

export const lang: KnockoutObservable<string> = ko.observable(localStorage.getItem('lang') || 'vi');

ko.computed({
    read: () => {
        localStorage.setItem('lang', ko.toJS(lang));
    }
});