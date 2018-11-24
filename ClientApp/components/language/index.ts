import { ko } from '@app/providers';
import { component } from '@app/common/ko';
import { lang, i18n } from '@app/common/lang';

@component({
    name: 'i18n-lang',
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class LanguageComponent {
    lang: KnockoutObservable<string> = lang;
    regions: KnockoutObservableArray<string> = ko.observableArray(ko.utils.keys(i18n));
}