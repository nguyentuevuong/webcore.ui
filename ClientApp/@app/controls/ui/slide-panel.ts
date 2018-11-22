import { _, ko } from '@app/providers';

import { handler } from '@app/common/ko';
import { lang, getText } from '@app/common/lang';

import { IComponent, Components } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'slidePanel'
})
export class SlidePanelBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        /*let hide = true,
            $element = $(element),
            accessor: any = valueAccessor(),
            params: any = ko.unwrap(accessor.params),
            viewName: string = ko.toJS(accessor.viewName),
            configs: any = ko.unwrap(accessor.configs),
            $panel = $('<div>', { 'class': 'panel animated' }).appendTo($element),
            $content = $('<div>', { 'class': 'content' }).appendTo($panel),
            $show = $('<a>', { 'class': 'show-btn noselect' }).appendTo($panel),
            $show_div = $('<section>', {}).appendTo($show)
                .append($('<i>', { 'class': 'fa fa-search fa-2x' })),
            $span = $('<span>', { 'text': 'Search #{any}' }).appendTo($show_div);

        ko.computed({
            read: () => {
                ko.toJS(lang);

                let _comp = _.find(Components, (c: IComponent) => _.isEqual(c.name, viewName));

                if (_comp) {
                    $span.text(getText(_comp.title || ''));
                }
            }
        })

        $element
            .addClass('panel-container')
            .on('click', () => {
                $panel
                    .addClass('slideOutLeft');
            });

        $show.on('click', (evt) => {
            if (hide) {
                hide = false;
                $panel
                    .addClass('show')
                    .addClass('show-2x')
                    .addClass('fadeInLeft');
            } else {
                $panel
                    .addClass('slideOutLeft');
            }
            // prevent event for $element
            evt.stopImmediatePropagation();
        });

        $panel.on('click', evt => {
            evt.stopImmediatePropagation();
        }).on('animationend', () => {
            if ($panel.hasClass('slideOutLeft')) {
                hide = true;

                $panel
                    .removeClass('show')
                    .removeClass('show-2x')
                    .removeClass('fadeInLeft')
                    .removeClass('slideOutLeft');

                $element.removeClass('show');
            } else {
                $element.addClass('show');
            }
        });

        // bind component to modal
        ko.bindingHandlers['component'].init!($content[0], () => ({ name: viewName || 'no-component', params: params }), allBindingsAccessor, viewModel, bindingContext);*/
        return { controlsDescendantBindings: true };
    }
}