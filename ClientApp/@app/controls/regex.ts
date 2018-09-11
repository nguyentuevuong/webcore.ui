import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'regex'
})
export class RegexBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let accessor = valueAccessor(),
            value = accessor.value,
            pattern: RegExp = accessor.pattern;

        allBindingsAccessor = () => ko.utils.extend(allBindingsAccessor(), {
            valueUpdate: "afterkeydown"
        });

        ko.computed({
            read: () => {
                let origt: string = ko.toJS(value),
                    replt: RegExpExecArray | null = pattern.exec(origt);
                debugger;
                if (!replt) {
                    value('');
                } else {
                    value(replt[0]);
                }
            }
        });
    }
}