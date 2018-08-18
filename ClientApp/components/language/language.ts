import * as ko from 'knockout';
import * as _ from 'lodash';

import { lang, i18n } from '../../common/app-i18n';
import { component } from '../../decorator/component';

@component({
    name: 'i18n-lang',
    template: require('./language.html'),
    resources: require('./resources.json')
})
export class LanguageComponent {
    lang: KnockoutObservable<string> = lang;
    regions: KnockoutObservableArray<string> = ko.observableArray(_.keys(i18n));
}