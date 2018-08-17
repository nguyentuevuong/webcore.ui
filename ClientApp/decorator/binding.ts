import * as ko from 'knockout';

interface IBindingParams {
    virtual?: boolean;
    bindingName: string;
}

interface BindingConstructor {
    new(): any;
}

export function handler(params: IBindingParams) {
    return function (constructor: BindingConstructor) {
        ko.bindingHandlers[params.bindingName] = new constructor();
        ko.virtualElements.allowedBindings[params.bindingName] = !!params.virtual;
    }
}