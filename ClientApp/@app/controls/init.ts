import { _, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: true,
    bindingName: 'init'
})
export class LetBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let accessor: IInit = valueAccessor();

        _.each(_.keys(accessor), (key: string) => {
            let $getter = _.get(bindingContext, key, undefined);

            if (ko.isObservable($getter)) {
                $getter(ko.toJS(accessor[key]));
            } else {
                _.update(bindingContext, key, () => accessor[key]);
            }
        });
    }
}

interface IInit {
    [key: string]: any
}