import * as ko from 'knockout';

import { handler } from '../decorator/binding';

@handler({
    virtual: false,
    bindingName: 'i18n'
})
export class CheckboxBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.computed({
            read: () => {
                let _lang: string = ko.toJS(lang),
                    _i18n: string = ko.toJS(valueAccessor());

                element.innerText = _i18n.indexOf('#') == 0 ? i18n[_lang][_i18n.replace('#', '')] : _i18n;
            }
        });
    }
}

export const i18n: {
    [lang: string]: {
        [key: string]: string
    }
} = {
    'en': {
        'en': 'English',
        'vi': 'Tiếng Việt',
        'home': 'Home',
        'language': 'Language',
        'login': 'Login'
    },
    'vi': {
        'en': 'English',
        'vi': 'Tiếng Việt',
        'home': 'Trang chủ',
        'language': 'Ngôn ngữ',
        'login': 'Đăng nhập'
    }
};

export const lang: KnockoutObservable<string> = ko.observable('vi');