import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

import { IComponent, Components, handler, getText } from '@app/common';

@handler({
    virtual: true,
    bindingName: 'modal'
})
export class ModalBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let $element = $(element),
            accessor: any = valueAccessor(),
            params: any = ko.unwrap(accessor.params),
            viewName: string = ko.toJS(accessor.viewName),
            configs: IModalConfigs = ko.unwrap(accessor.configs) || {};


        $element.on('click', () => {
            if (_.isString(viewName) && !_.isEmpty(viewName)) {
                let $modal = $('<div>', { 'class': 'modal fade', role: 'dialog', tabindex: -1 }),
                    $dialog = $('<div>', { 'class': 'modal-dialog', role: 'document' }), //modal-lg modal-dialog-centered
                    $content = $('<div>', { 'class': 'modal-content' }),
                    $header = $('<div>', { 'class': 'modal-header' }),
                    $htitle = $('<h4>', { 'class': 'modal-title', html: '#noname' }),
                    $hclose = $('<span>', { 'class': 'close', 'data-dismiss': 'modal', html: '&times;' }),
                    $body = $('<div>', { 'class': 'modal-body' });

                $modal.append($dialog);
                $dialog.append($content);

                let _comp = _.find(Components, (c: IComponent) => _.isEqual(c.name, viewName));

                if (!_.isNil(_comp)) {
                    $htitle.empty();
                    $htitle.append($('<i>', { 'class': `${_comp.icon} mr-2` })).append($('<span>', { text: getText(_comp.title || '') }));
                }

                $header.append($htitle).append($hclose);

                $content
                    .append($header)
                    .append($body);

                $('body').append($modal);

                (<any>$modal).modal({
                    show: true,
                    focus: true,
                    backdrop: !!ko.toJS(configs.backdrop),
                });

                ko.computed({
                    read: () => {
                        let modaless: boolean = ko.toJS(configs.modaless);

                        if (modaless) {
                            $modal.addClass('modaless');
                        } else {
                            $modal.removeClass('modaless');
                        }
                    }
                });

                $modal
                    .on('shown.bs.modal', () => {
                        let modaless: boolean = ko.toJS(configs.modaless);

                        if (!modaless) {
                            // remove tabindex of all input item
                            $('body [tabindex], body a, body button, body input, body select, body textarea').each((i, tab) => {
                                let $tab = $(tab);

                                $tab
                                    .attr({
                                        'data-tabindex': _.isNil($tab.attr('tabindex')) ? -1 : $tab.attr('tabindex')
                                    }).attr({
                                        'tabindex': '-1'
                                    });
                            });

                            $body.find('[tabindex]').each((i, tab) => {
                                let $tab = $(tab);

                                if ($tab.attr('data-tabindex') != '-1') {
                                    $tab
                                        .attr({
                                            'tabindex': $tab.attr('data-tabindex')
                                        })
                                } else {
                                    $tab.removeAttr('tabindex');
                                }

                                $tab.removeAttr('data-tabindex');
                            });
                        }

                        // bind component to modal
                        ko.bindingHandlers['component'].init!($body[0], () => ({ name: viewName || 'no-component', params: params }), allBindingsAccessor, viewModel, bindingContext);
                    })
                    .on('hidden.bs.modal', () => {
                        // remove modal when hide
                        (<any>$modal).modal('dispose').remove();

                        // restore all tabindex
                        $('body').find('[tabindex]').each((i, tab) => {
                            let $tab = $(tab);

                            if ($tab.attr('data-tabindex') != '-1') {
                                $tab
                                    .attr({
                                        'tabindex': $tab.attr('data-tabindex')
                                    })
                            } else {
                                $tab.removeAttr('tabindex');
                            }

                            $tab.removeAttr('data-tabindex');
                        });

                        // focus to old element
                        $element.focus();
                    }).find('.modal-content').draggable({
                        handle: ".modal-header"
                    });
            }
        });
    }
}

export interface IModalConfigs {
    size: 'lg' | 'md' | 'sm' | KnockoutObservable<string>,
    backdrop: boolean | KnockoutObservable<boolean>,
    closeBtn: boolean | KnockoutObservable<boolean>,
    modaless: boolean | KnockoutObservable<boolean>
}