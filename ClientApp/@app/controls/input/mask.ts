import { $, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'mask'
})
export class MaskInputBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLInputElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let value: KnockoutObservable<string> = valueAccessor(),
            pattern: string | KnockoutObservable<string> = allBindingsAccessor().pattern;

        ko.utils.registerEventHandler(element, 'keydown', (evt: KeyboardEvent) => {

        });

        ko.utils.registerEventHandler(element, 'keypress', (evt: KeyboardEvent) => {

        });

        ko.utils.registerEventHandler(element, 'keyup', (evt: KeyboardEvent) => {

        });

        return { controlsDescendantBindings: true };
    }
}