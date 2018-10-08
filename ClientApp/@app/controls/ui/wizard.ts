
import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'wizard'
})
export class WizardBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let bindings = allBindingsAccessor();

        ko.bindingHandlers.component.init!(element, () => ({
            name: 'wizard',
            params: {
                steps: valueAccessor(),
                selected: bindings.selected,
                disableds: bindings.disableds,
                configs: bindings.configs
            }
        }), allBindingsAccessor, viewModel, bindingContext);

        element.className = 'wizard noselect';

        return { controlsDescendantBindings: true };
    }
}