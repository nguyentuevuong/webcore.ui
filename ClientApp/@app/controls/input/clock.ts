import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'clock'
})
export class TimeEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let control: ValidationObservable<any> = valueAccessor();

        ko.utils.dom.addClass(element, 'form-group row');

        control
            .extend({
                $raw: ko.toJS(control),
                $value: ko.toJS(control)
            }).extend({
                $type: {
                    mask: Date
                }
            });

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        control.$raw!.subscribe((raw: any) => {
            // validate and rebind value to control at here
            control.checkError!(raw);

            if (!control.hasError!()) {
            }
        });

        return { controlsDescendantBindings: true };
    }
}