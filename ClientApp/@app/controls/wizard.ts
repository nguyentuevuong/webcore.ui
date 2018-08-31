import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler, getText } from '@app/common';

@handler({
    virtual: false,
    bindingName: 'wizard'
})
export class WizardBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            accessor: any = valueAccessor(),
            $header = $('<div>', { 'class': 'header' }).appendTo($element),
            $icon = $('<div>', { 'class': 'img' }).appendTo($header),
            $title = $('<h5>', {}).appendTo($header),
            $steps = $('<ul>', { 'class': 'step-list list-group' }).appendTo($element),
            $footer = $('<div>', { 'class': 'footer btn-group d-none' }).appendTo($element),
            $prev = $('<button>', { 'class': 'btn btn-link', html: [$('<i>', { 'class': 'fas fa-arrow-circle-left' })] }).appendTo($footer),
            $prevt = $('<span>').appendTo($prev),
            $next = $('<button>', { 'class': 'btn btn-link', html: [$('<i>', { 'class': 'fas fa-arrow-circle-right' })] }).appendTo($footer),
            $nextt = $('<span>').prependTo($next);

        $element.addClass('wizard noselect');

        ko.bindingHandlers['i18n']!.init!($title[0], () => accessor.title, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers['i18n']!.init!($prevt[0], () => '#preview', allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers['i18n']!.init!($nextt[0], () => '#next', allBindingsAccessor, viewModel, bindingContext);

        ko.computed({
            read: () => {
                let icon = ko.toJS(accessor.icon);

                if (icon) {
                    $icon.append($('<i>', { 'class': icon }));
                }
            }
        });

        ko.computed({
            read: () => {
                let step: number = ko.toJS(accessor.step),
                    steps: string[] = ko.toJS(accessor.steps),
                    selectable: boolean = ko.toJS(accessor.selectable);

                $steps.empty();
                _.each(steps, (s: string, i: number) => {
                    $('<li>', { 'class': `list-group-item ${step == i ? 'active' : ''}`, text: getText(s) })
                        .appendTo($steps)
                        .on('click', () => {
                            if (selectable && _.size(steps) >= i + 1) {
                                accessor.step(i);
                            }
                        });
                });

                $prev.prop('disabled', step <= 0);
                $next.prop('disabled', step >= _.size(steps) - 1);
            }
        });

        ko.computed({
            read: () => {
                let showFooter: boolean = ko.toJS(accessor.showFooter);

                if (!showFooter) {
                    $footer.addClass('d-none');
                } else {
                    $footer.removeClass('d-none');
                }
            }
        });

        ko.bindingHandlers.click.init!($prev[0], () => () => {
            let step: number = ko.toJS(accessor.step);

            accessor.step(--step);
        }, allBindingsAccessor, viewModel, bindingContext);

        ko.bindingHandlers.click.init!($next[0], () => () => {
            let step: number = ko.toJS(accessor.step);

            accessor.step(++step);
        }, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}