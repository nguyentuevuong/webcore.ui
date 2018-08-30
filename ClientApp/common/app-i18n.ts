import * as _ from 'lodash';
import * as $ from 'jquery';
import * as ko from 'knockout';

import './ajax-ext';

import { handler } from './binding';

@handler({
    virtual: false,
    bindingName: 'i18n'
})
export class CheckboxBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any) => {
        ko.computed({
            read: () => {
                let _lang: string = ko.toJS(lang),
                    _i18n: string | II18N = ko.toJS(valueAccessor());

                if (_.isString(_i18n)) {
                    if (_i18n.indexOf('#') == -1) {
                        element.innerText = i18n[_lang][_i18n] || _i18n;
                    }
                    else if (_i18n.indexOf('#') == 0) {
                        element.innerText = i18n[_lang][_i18n.replace('#', '')] || _i18n;
                    } else {
                        element.innerText = _i18n;
                    }
                } else {
                    _.each(_.keys(_i18n), prop => {
                        let resource = _.get(_i18n, prop);

                        if (_.isString(resource)) {
                            if (prop == 'html') {
                                if (resource.indexOf('#') == -1) {
                                    element.innerHTML = i18n[_lang][resource] || resource;
                                }
                                else if (resource.indexOf('#') == 0) {
                                    element.innerHTML = i18n[_lang][resource.replace('#', '')] || resource;
                                } else {
                                    element.innerHTML = resource;
                                }
                            } else if (prop == 'text') {
                                if (resource.indexOf('#') == -1) {
                                    element.innerText = i18n[_lang][resource] || resource;
                                }
                                else if (resource.indexOf('#') == 0) {
                                    element.innerText = i18n[_lang][resource.replace('#', '')] || resource;
                                } else {
                                    element.innerText = resource;
                                }
                            } else {
                                if (resource.indexOf('#') == -1) {
                                    element.setAttribute(prop, i18n[_lang][resource] || resource);
                                }
                                else if (resource.indexOf('#') == 0) {
                                    element.setAttribute(prop, i18n[_lang][resource.replace('#', '')] || resource);
                                } else {
                                    element.setAttribute(prop, resource);
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

interface II18N {
    html?: string;
    text?: string;
    title?: string;
    placeholder?: string;
}

export const i18n: {
    [lang: string]: {
        [key: string]: string
    }
} = {
    'en': {
        'en': 'English',
        'vi': 'Tiếng Việt'
    },
    'vi': {
        'en': 'English',
        'vi': 'Tiếng Việt'
    }
};

export const lang: KnockoutObservable<string> = ko.observable(localStorage.getItem('lang') || 'vi');

ko.computed({
    read: () => {
        localStorage.setItem('lang', ko.toJS(lang));
    }
});

// sua ham nay de get resource nhung va dung cho ham computed o bind i18n
export const getText = (resource: string) => i18n[ko.toJS(lang)][resource.replace('#', '')];