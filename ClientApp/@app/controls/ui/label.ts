import * as ko from 'knockout';
import * as $ from 'jquery';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'label'
})
export class LabelControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let control: ValidationObservable<any> = valueAccessor();

        // bind label component
        ko.bindingHandlers.component.init!(element, () => ({
            name: 'label', params: { control: control }
        }), allBindingsAccessor, viewModel, bindingContext);

        // bind css
        ko.bindingHandlers.css.update!(element, () => ({
            'control-label control-label-block mb-1': true,
            'control-label-danger': ko.toJS(control.$require)
        }), allBindingsAccessor, viewModel, bindingContext);

        // bind for attr
        ko.bindingHandlers.attr.update!(element, () => ({
            'for': ko.toJS(control.$attr).id
        }), allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}