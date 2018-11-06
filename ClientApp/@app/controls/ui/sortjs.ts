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
export class SortJSControlBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let sortable: Sortable | null = null,
            accessor = valueAccessor(),
            dataSources = ko.unwrap(accessor.data || accessor),
            configs = ko.toJS(allBindingsAccessor().configs),
            onSelect: Function = configs && configs.onSelect || function () { },
            onDrag: Function = configs && configs.onDrag || function () { },
            onDrop: Function = configs && configs.onDrop || function () { },
            afterRender: Function = accessor.afterRender || function () { },
            beforeRemove: Function = accessor.beforeRemove || function () { };

        configs = configs || {};

        ko.utils.extend(configs, {
            onSelect: (evt: MouseEvent, data: ISortableData) => {
                onSelect.apply(viewModel, [evt, data]);
            },
            onDrag: (evt: MouseEvent, data: ISortableData) => {
                onDrag.apply(viewModel, [evt, data]);
            },
            onDrop: (evt: MouseEvent, data: ISortableData) => {
                onDrop.apply(viewModel, [evt, data]);
            }
        });

        let newBinding = ko.utils.extendBindingsAccessor('data' in accessor ? valueAccessor : () => ({ data: dataSources }), {
            afterRender: function (child: HTMLElement, record: any) { dataSet(child, ITEMKEY, record); afterRender.apply(viewModel, [child, record]); },
            beforeRemove: function (child: HTMLTableRowElement, index: number, record: any) { beforeRemove.apply(viewModel, [child, index, record]) }
        });

        ko.bindingHandlers.foreach.init!(element, newBinding, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers.foreach.update!(element, newBinding, allBindingsAccessor, viewModel, bindingContext);

        sortable = new Sortable(element, configs);

        return { controlsDescendantBindings: true };
    }
}

interface ISortableData {
    sourceParentNode: HTMLElement;
    sourceIndex: number;
    targetParentNode: HTMLElement,
    targetIndex: number;
    cancelDrop: boolean;
}