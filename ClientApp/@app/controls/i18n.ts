import { _, ko } from '@app/providers';

import { handler } from '@app/common/ko';
import { lang, i18n, Ii18n } from '@app/common/lang';

@handler({
    virtual: false,
    bindingName: 'i18n'
})
export class I18nBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any) => {
        ko.computed({
            read: () => {
                let _lang: string = ko.toJS(lang),
                    _i18n: string | Ii18n = ko.toJS(valueAccessor());

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