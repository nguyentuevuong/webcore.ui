import { _, ko } from '@app/providers';
import { i18n } from '@app/common/lang';

interface IBindingParams {
    virtual?: boolean;
    bindingName: string;
    resources?: {
        [lang: string]: {
            [key: string]: string
        }
    }
}

interface BindingConstructor {
    new(): any;
}

export function handler(params: IBindingParams) {
    return function (constructor: BindingConstructor) {
        // merge resources
        _.merge(i18n, params.resources);

        ko.bindingHandlers[params.bindingName] = new constructor();
        ko.virtualElements.allowedBindings[params.bindingName] = !!params.virtual;
    }
}