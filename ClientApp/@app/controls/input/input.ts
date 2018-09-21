import { $, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'input'
})
export class TextEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            control: ValidationObservable<any> = valueAccessor();

        $element
            .addClass('form-group row');

        control
            .extend({
                $raw: ko.toJS(control),
                $value: ko.toJS(control)
            })
            .extend({
                $type: {
                    mask: String
                }
            });

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        control.$raw!.subscribe((raw: any) => {
            // validate and rebind value to control at here
            control.checkError!(raw);
            console.log(raw);
            if (!control.hasError!()) {
                control(raw);
            }
        });

        return { controlsDescendantBindings: true };
    }
}