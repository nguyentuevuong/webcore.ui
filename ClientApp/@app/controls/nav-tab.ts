import { _, $, ko } from '@app/providers';
import { handler } from '@app/common/ko';

@handler({
    virtual: true,
    bindingName: 'tabs'
})
export class SwitchBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let click: boolean = false,
            $element = $(element),
            accessor: any = valueAccessor();

        $element.addClass('nav nav-tabs noselect');

        ko.computed({
            read: () => {
                let $tab: string = ko.toJS(accessor.selected),
                    tabs: Array<string> = ko.toJS(accessor.dataSources);

                $element.empty();

                _.each(tabs, tab => {
                    let $li = $('<li>', { 'class': 'nav-item' }),
                        $href = $('<a>', { 'class': `nav-link ${$tab == tab ? 'active' : ''}`, 'href': 'javascript:0' }).appendTo($li);

                    $href.text(tab);

                    $element.append($li);

                    $href.on('click', () => {
                        click = true;
                        accessor.selected!(tab);
                    });

                    if (click && $tab == tab) {
                        click = false;
                        $href.focus();
                    }
                })
            }
        })
    }
}