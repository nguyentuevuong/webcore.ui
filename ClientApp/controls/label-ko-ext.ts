import * as ko from 'knockout';
import * as $ from 'jquery';
import { handler } from '../decorator/binding';

@handler({
    bindingName: 'ntsLabel'
})
export class LabelControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element);

        $element
            .addClass('control-label')
            .data('text', $element.text());
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            access = valueAccessor(),
            required = ko.unwrap(access.require),
            inline = ko.unwrap(access.inline),
            text = ko.unwrap(access.text),
            constraint = ko.unwrap(access.constraint);

        if (required) {
            $element.addClass('control-label-danger');
        } else {
            $element.removeClass('control-label-danger');
        }

        if (inline) {
            $element.addClass('control-label-inline');
        } else {
            $element.removeClass('control-label-inline');
        }

        $element.empty();

        if (text) {
            $element.append($('<span>', {text: text}));
        } else {
            $element.append($('<span>', {text: $element.data('text') || 'ERROR_NO_TEXT'}));
        }

        if (constraint) {
            $element.append($('<span>', {html: constraint}));
        }
    }
}