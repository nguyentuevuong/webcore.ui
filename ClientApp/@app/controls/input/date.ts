import { $, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'date'
})
export class DateEditorBindingHandler implements KnockoutBindingHandler {
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
                $icons: {
                    after: 'fa fa-calendar'
                },
                $width: 150
            })
            .extend({
                $type: {
                    mask: Date,
                    min: new Date(1900, 0, 1),
                    max: new Date(9999, 11, 31),
                    lazy: true
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