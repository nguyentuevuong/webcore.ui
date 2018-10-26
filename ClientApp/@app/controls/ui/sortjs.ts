import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

import { Sortable } from '@app/common/ui/sortable';

const ITEMKEY = "ko_sortItem",
    INDEXKEY = "ko_sourceIndex",
    LISTKEY = "ko_sortList",
    PARENTKEY = "ko_parentList",
    DRAGKEY = "ko_dragItem",
    dataSet = ko.utils.domData.set,
    dataGet = ko.utils.domData.get,
    addMetaDataAfterRender = (elements: any, data: any) => {
        ko.utils.arrayForEach(elements, (element: any) => {
            if (element.nodeType === 1) {
                dataSet(element, ITEMKEY, data);
                dataSet(element, PARENTKEY, dataGet(element.parentNode, LISTKEY));
            }
        });
    };

@handler({
    bindingName: 'sortjs'
})
export class LabelControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let array = ko.utils.unwrapObservable(valueAccessor().data || valueAccessor());

        dataSet(element, LISTKEY, array);

        let newBinding = ko.utils.extendBindingsAccessor(valueAccessor, {
            afterRender: function (child: HTMLElement, item: any) {
                dataSet(child, ITEMKEY, item);

                if (ko.utils.arrayIndexOf(array, item) == ko.utils.arraySize(array) - 1) {
                    new Sortable(element);
                }
            }
        });

        ko.bindingHandlers.foreach.init!(element, newBinding, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers.foreach.update!(element, newBinding, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}