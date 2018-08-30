import * as ko from "knockout";
import * as $ from 'jquery';
import { handler } from "../common/binding";


// Knockout doesn't allow to use 'css: className' and 'css: { 'class-name': boolValue }' bindings on same element
// This binding can be used together with 'css: { 'class-name': boolValue }'
// Inspired by https://github.com/knockout/knockout/wiki/Bindings---class
var previousClassKey = '__ko__previousClassValue__';

@handler({
    virtual: false,
    bindingName: 'ntsClass'
})
export class ClassBindingHandler implements KnockoutBindingHandler {
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            value = ko.unwrap(valueAccessor());

        if ($element.data(previousClassKey)) {
            ko.utils.toggleDomNodeCssClass(element, $element.data(previousClassKey), false);
        }

        ko.utils.toggleDomNodeCssClass(element, value, true);

        $element.data(previousClassKey, value);
    }
}