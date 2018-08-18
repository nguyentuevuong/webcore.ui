import * as ko from 'knockout';
import * as _ from 'lodash';

import { lang, i18n } from '../../common/app-i18n';
import { component } from '../../decorator/component';

@component({
    name: 'i18n-lang',
    template: `<li class="nav-item dropdown">
        <a class="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">
            <i class="fa fa-globe"></i>
            <span data-bind="i18n: { text: '#language' }"></span>
        </a>
        <div class="dropdown-menu dropdown-menu-right" data-bind="foreach: regions">
            <a class="dropdown-item" href="#" data-bind="i18n: { text: '#' + $data }, click: $vm.lang.bind($vm.lang, $data), css: { 'active': ko.toJS($vm.lang) == $data  }"></a>
        </div>
    </li>`,
    resources: require('./resources.json')
})
export class LanguageComponent {
    lang: KnockoutObservable<string> = lang;
    regions: KnockoutObservableArray<string> = ko.observableArray(_.keys(i18n));
}