import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'input'
})
export class TextEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let control: ValidationObservable<any> = valueAccessor();

        ko.utils.dom.addClass(element, 'form-group row');

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}