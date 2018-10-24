import { _, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: true,
    bindingName: 'init'
})
export class InitBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let accessor: IInit = valueAccessor();
        
        ko.utils.objectForEach(accessor, (key: string, value: any) => {
            let obser = _.get(bindingContext, key);

            if (ko.isObservable(obser)) {
                obser(ko.toJS(value));
            } else {
                _.update(bindingContext, key, () => value);
            }
        });
    }
}

interface IInit {
    [key: string]: any
}