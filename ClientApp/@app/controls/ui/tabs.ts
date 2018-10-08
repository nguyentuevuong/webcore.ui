import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: true,
    bindingName: 'tabs'
})
export class SwitchBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let bindings = allBindingsAccessor();

        ko.bindingHandlers.component.init!(element, () => ({
            name: 'tabs',
            params: {
                tabs: valueAccessor(),
                selected: bindings.selected,
                disableds: bindings.disableds
            }
        }), allBindingsAccessor, viewModel, bindingContext);

        element.attributes.removeNamedItem('role');
        element.className = 'nav nav-tabs noselect';

        return { controlsDescendantBindings: true };
    }
}