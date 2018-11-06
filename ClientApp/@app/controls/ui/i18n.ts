import { _, ko } from '@app/providers';

import { handler } from '@app/common/ko';
import { Ii18n, i18text } from '@app/common/lang';

@handler({
    virtual: false,
    bindingName: 'i18n'
})
export class I18nBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.computed({
            read: () => {
                let i18n: string | Ii18n = ko.toJS(valueAccessor()),
                    params: { [key: string]: string } = ko.toJS(allBindingsAccessor().params);

                if (typeof i18n == 'string') {
                    element.innerText = i18text(i18n, params);
                } else {
                    _.forIn(i18n, (resource: any, prop: any) => {
                        if (_.isString(resource)) {
                            if (prop == 'html') {
                                element.innerHTML = i18text(resource, params);
                            } else if (prop == 'text') {
                                element.innerText = i18text(resource, params);
                            } else {
                                element.setAttribute(prop, i18text(resource, params));
                            }
                        }
                    });
                }
            }
        });
    }
}