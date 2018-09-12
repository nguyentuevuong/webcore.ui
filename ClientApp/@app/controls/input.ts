import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';

import { handler } from '@app/common/ko';

@handler({
    bindingName: 'input'
})
export class TextEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            control: KnockoutObservable<any> = valueAccessor();

        $element
            .addClass('form-group row');

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}