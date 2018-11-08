import { ko } from '@app/providers';
import { i18n } from '@app/common/lang';

interface IBindingParams {
    virtual?: boolean;
    bindingName: string;
    validatable?: boolean;
    resources?: {
        [lang: string]: {
            [key: string]: string;
        }
    }
}

interface BindingConstructor {
    new(): any;
}

export function handler(params: IBindingParams) {
    return function (constructor: BindingConstructor) {
        // merge resources
        ko.utils.merge(i18n, params.resources);

        ko.bindingHandlers[params.bindingName] = new constructor();
        ko.virtualElements.allowedBindings[params.bindingName] = !!params.virtual;

        // block rewrite binding
        if (params.validatable) {
            let validator: {
                [key: string]: boolean
            } = {};

            validator[params.bindingName] = false;

            ko.utils.extend(ko.expressionRewriting.bindingRewriteValidators, validator);
        }
    }
}