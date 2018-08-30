import * as ko from 'knockout';
import * as _ from 'lodash';

import { lang, i18n, component } from '../../common';

@component({
    name: 'i18n-lang',
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class LanguageComponent {
    lang: KnockoutObservable<string> = lang;
    regions: KnockoutObservableArray<string> = ko.observableArray(_.keys(i18n));
}