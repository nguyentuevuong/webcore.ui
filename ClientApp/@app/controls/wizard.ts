import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler } from '@app/common/ko';
import { getText } from '@app/common/lang';

@handler({
    virtual: false,
    bindingName: 'wizard'
})
export class WizardBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            $step: KnockoutObservableArray<string> | Array<string> = valueAccessor(),
            $allBinding: IBindings = allBindingsAccessor(),
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

        ko.bindingHandlers['i18n']!.init!($title[0], () => ($allBinding.configs || {title: '#no_title'}).title, allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers['i18n']!.init!($prevt[0], () => '#preview', allBindingsAccessor, viewModel, bindingContext);
        ko.bindingHandlers['i18n']!.init!($nextt[0], () => '#next', allBindingsAccessor, viewModel, bindingContext);

        ko.computed({
            read: () => {
                $icon.append($('<i>', { 'class': ko.toJS(($allBinding.configs || { icon: 'd-none' }).icon) }));
            }
        });

        ko.computed({
            read: () => {
                let step: string = ko.toJS($allBinding.selected),
                    steps: string[] = ko.toJS($step),
                    selectable: boolean = ko.toJS(($allBinding.configs || {}).selectable);

                $steps.empty();
                _.each(steps, (s: string, i: number) => {
                    $('<li>', { 'class': `list-group-item ${_.isEqual(step, s) ? 'active' : ''}`, text: getText(s) })
                        .appendTo($steps)
                        .on('click', () => {
                            if (selectable && _.size(steps) >= i + 1) {
                                if (ko.isObservable($allBinding.selected)) {
                                    $allBinding.selected!(s);
                                }
                            }
                        });
                });

                $prev.prop('disabled', _.indexOf(steps, step) <= 0);
                $next.prop('disabled', _.indexOf(steps, step) >= _.size(steps) - 1);
            }
        });

        ko.computed({
            read: () => {
                let showFooter: boolean = ko.toJS(($allBinding.configs || {}).showFooter);

                if (!showFooter) {
                    $footer.addClass('d-none');
                } else {
                    $footer.removeClass('d-none');
                }
            }
        });

        ko.bindingHandlers.click.init!($prev[0], () => () => {
            let steps: Array<string> = ko.toJS($step),
                selected: string = ko.toJS($allBinding.selected),
                index = _.indexOf(steps, selected);

            if (ko.isObservable($allBinding.selected)) {
                $allBinding.selected(steps[--index]);
            }
        }, allBindingsAccessor, viewModel, bindingContext);

        ko.bindingHandlers.click.init!($next[0], () => () => {
            let steps: Array<string> = ko.toJS($step),
                selected: string = ko.toJS($allBinding.selected),
                index = _.indexOf(steps, selected);

            if (ko.isObservable($allBinding.selected)) {
                $allBinding.selected!(steps[++index]);
            }
        }, allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: true };
    }
}

interface IBindings {
    selected: KnockoutObservable<string> | string;
    disableds?: KnockoutObservableArray<string> | Array<string>;
    configs?: IConfigs
}

interface IConfigs {
    icon?: KnockoutObservable<string> | string;
    title?: KnockoutObservable<string> | string;
    showFooter?: KnockoutObservable<boolean> | boolean;
    selectable?: KnockoutObservable<boolean> | boolean;
}