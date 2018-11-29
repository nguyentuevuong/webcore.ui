import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import { i18text } from '@app/common/lang';

@handler({
    bindingName: 'label'
})
export class LabelControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => ValidationObservable<any>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let dom = ko.utils.dom,
            control = valueAccessor();

        // bind for attr
        dom.setAttr(element, 'for', ko.toJS(control.$attr).id);

        dom.addClass(element, 'control-label control-label-block mb-1');

        return { controlsDescendantBindings: true };
    }
    update = (element: HTMLElement, valueAccessor: () => ValidationObservable<any>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let dom = ko.utils.dom,
            control = valueAccessor(),
            $name = ko.toJS(control.$name),
            $require = ko.toJS(control.$require),
            $constraint = ko.toJS(control.$constraint);

        element.innerHTML = '';

        if ($require) {
            dom.addClass(element, 'control-label-danger');
        } else {
            dom.removeClass(element, 'control-label-danger');
        }

        if (!$name) {
            dom.addClass(element, 'd-none');
        } else {
            dom.removeClass(element, 'd-none');
            element.appendChild(dom.create('span', { text: i18text($name) }));
        }

        if ($constraint) {
            element.appendChild(dom.create('span', { text: i18text($constraint) }));
        }
    }
}