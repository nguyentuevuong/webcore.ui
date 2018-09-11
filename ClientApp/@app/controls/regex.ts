import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'regex'
})
export class RegexBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLInputElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let accessor = valueAccessor(),
            value = accessor.value,
            pattern: RegExp = accessor.pattern;

        element.onkeyup = (evt: KeyboardEvent) => {
            let origt: string = element.value || '',
                replt: RegExpExecArray | null = pattern.exec(origt);

            if (!replt) {
                value('');
            } else {
                value(replt[0]);
            }

            // rebind value to input
            element.value = ko.toJS(value);
        };
    }
}