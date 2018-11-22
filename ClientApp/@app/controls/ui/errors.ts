import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    bindingName: 'errors',
    resources: {
        'en': {
            'show_errors': 'List errors'
        },
        'vi': {
            'show_errors': 'Danh sách lỗi'
        }
    }
})
export class ErrorsControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let errors: KnockoutObservableError = valueAccessor(),
            soh: {} = ko.utils.domData.get(element, '__soh__');

        element.className = "btn btn-sm btn-link btn-link-errors";

        if (!soh) {
            soh = ko.computed({
                read: () => {
                    let lste: Array<any> = ko.toJS(errors);

                    if (lste.length && ko.toJS(errors.showDialog)) {
                        element.classList.add('show');
                    } else {
                        element.classList.remove('show');
                    }
                }
            })

            ko.utils.domData.set(element, '__soh__', soh);
        }

        ko.bindingHandlers.i18n.init!(element, () => ({ text: '#show_errors' }), allBindingsAccessor, viewModel, bindingContext);

        ko.bindingHandlers.click.init!(element, () => (evt: MouseEvent) => {

        }, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}