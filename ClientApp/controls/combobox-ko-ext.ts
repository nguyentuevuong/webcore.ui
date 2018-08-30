import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { handler } from '../common/binding';

@handler({
    virtual: false,
    bindingName: 'ntsSelect'
})
export class ComboboxBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element);

        $element
            .addClass('form-group');
    };
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            accessor = valueAccessor(),
            configs = _.has(accessor, 'configs') ? ko.unwrap(accessor.configs) : {},

            $select = $('<select>', {
                'class': 'form-control',
                'data-container': 'body',
                'data-live-search': true
            });

        for (let i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
            $select.append($('<option>', { value: i, text: 'Option ' + i }));
        }

        $element.append($select);
    }
}