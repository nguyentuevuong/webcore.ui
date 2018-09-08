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
            tabs: KnockoutObservableArray<string> | Array<string> = valueAccessor(),
            options: IOptions = allBindingsAccessor();

        $element.addClass('nav nav-tabs noselect');

        ko.computed({
            read: () => {
                let $tabs = ko.toJS(tabs),
                    $selected: string = ko.toJS(options.selected),
                    $disableds: Array<string> = ko.toJS(options.disableds) || [];

                $element.empty();

                _.each($tabs, tab => {
                    let $li = $('<li>', { 'class': 'nav-item' }),
                        $href = $('<a>', {
                            'text': tab,
                            'href': 'javascript:void(0)',
                            'class': `nav-link ${$selected == tab ? 'active' : ''}`
                        }).appendTo($li);

                    if (_.indexOf($disableds, tab) > -1) {
                        $href.addClass('disabled');
                    } else {
                        $href.on('click', () => {
                            click = true;
                            if (ko.isObservable(options.selected)) {
                                options.selected(tab);
                            }
                        });

                        if (click && $selected == tab) {
                            click = false;
                            setTimeout(() => {
                                $href.focus();
                            }, 10);
                        }
                    }

                    $element.append($li);
                })
            }
        })
    }
}

interface IOptions {
    selected: KnockoutObservable<string>;
    disableds?: KnockoutObservableArray<string>;
}