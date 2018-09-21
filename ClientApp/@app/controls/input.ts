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
            control: ValidationObservable<any> = valueAccessor();

        $element
            .addClass('form-group row');

        control.extend({
            $raw: ko.toJS(control),
            $value: ko.toJS(control)
        });

        ko.bindingHandlers.component.init!(element, () => ({ name: 'input', params: { control: valueAccessor() } }), allBindingsAccessor, viewModel, bindingContext);

        ko.computed({
            read: () => {
                let raw = ko.toJS(control.$raw);
                // validate and rebind value to control at here
                
            }
        });

        return { controlsDescendantBindings: true };
    }
}