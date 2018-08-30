import { component } from "../../common";

import * as ko from 'knockout';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { Selectables } from '../../common/ui-selectable';

import { BaseComponentControl, IBaseConfigs, IBaseParamConstructor } from "./_base-comp";

const sout = () => {
    $('nts-selection .selection-container').each((i, select) => {
        let $vm = ko.dataFor(select);

        if (_.has($vm, "isShowDropdown")) {
            if (_.has($vm, "hasFocus") && !ko.toJS($vm.hasFocus)) {
                $vm.isShowDropdown(false);
                if (_.has($vm, 'focus')) {
                    $vm.focus(undefined);
                }
            }
        }
    });
};

$(document)
    .on('focus', '*', sout)
    .on('click', '*', sout);

@component({
    name: 'nts-selection',
    template: `
    <div class="row" data-bind="let: {
            $label: ko.toJS($vm.configs.label),
            $columns: ko.toJS($vm.configs.columns),
            $type: ko.toJS($vm.configs.type),
            $mode: ko.toJS($vm.configs.mode),
            $inline: ko.toJS($vm.configs.inline),
            css: {
                'form-group': ko.toJS($vm.configs.mode) != 'selection'
            }
        }">
        <!-- ko if: !!$label.text -->
        <div data-bind="css: $columns.label, component: { name: 'nts-label', params: $label }"></div>
        <!-- /ko -->
        <div data-bind="css: $columns.control">
            <!-- ko if: [$vm.$MODE.RADIO, $vm.$MODE.CHECKBOX].indexOf($mode) > -1 -->
                <!-- ko foreach: { data: $vm.options, as: 'option' } -->
                    <!-- ko let: { _id: $vm.$id() } -->
                        <div class="form-check" data-bind="css: {
                                'disabled': !!option['disabled'],
                                'form-check-inline checkbox-inline' : $inline
                            }">
                            <label class="form-check-label" data-bind="css: { 
                                    'form-check-circle': $vm.$MODE.RADIO == $mode,
                                    'form-check-danger': $vm.isInvalid(),
                                    'form-check-default': !$vm.isInvalid()
                                },
                                attr: {
                                    for: _id
                                }">
                                <input class="form-check-input" data-bind="
                                    checked: $vm.selectedOptions,
                                    checkedValue: option,
                                    attr: {
                                        id: _id,
                                        type: $type,
                                        name: $vm.$name,
                                        disabled: !!option['disabled']
                                    }">
                                <content id="template"></content>
                            </label>
                        </div>
                    <!-- /ko -->
                <!-- /ko -->
            <!-- /ko -->
            <!-- ko if: $vm.$MODE.BUTTON == $mode -->
                <div class="btn-group btn-group-toggle">
                    <!-- ko foreach: { data: $vm.options, as: 'option' } -->
                        <!-- ko let: { _id: $vm.$id() } -->
                            <label class="btn" data-bind="css: {
                                    'btn-secondary': ($vm.selectedOptions(), !$vm.checked(option)),
                                    'btn-primary active': ($vm.selectedOptions(), $vm.checked(option)),
                                    'disabled': !!option['disabled']
                                },
                                attr: {
                                    'tabindex': option['disabled'] ? undefined : 0,
                                    for: _id
                                }, event: {
                                    keydown: function(data, $event) {
                                        if([13, 32].indexOf($event.keyCode) > -1) {
                                            $event.target.click();
                                        }
                                        return true;
                                    }
                                }">
                                <input class="form-check-input d-none" data-bind="
                                    checked: $vm.selectedOptions,
                                    checkedValue: option,
                                    attr: {
                                        id: _id,
                                        type: $type,
                                        name: $vm.$name,
                                        disabled: !!option['disabled']
                                    }">
                                <content id="template"></content>
                            </label>
                        <!-- /ko -->
                    <!-- /ko -->
                </div>
            <!-- /ko -->
            <!-- ko if: $vm.$MODE.LISTBOX == $mode -->
                <div class="list-group form-group">
                    <div class="input-group">
                        <input type="text" class="form-control" data-bind="
                            value: $vm.keyword,
                            valueUpdate: 'afterkeydown',
                            hasFocus: $vm.hasFocus,
                            attr: { 
                                tabindex: 0
                            },
                            event: {
                                keydown: function($vm, $event) {
                                    if([13, 38, 40].indexOf($event.keyCode) > -1) {
                                        $vm.keydown.bind($vm, $event)();
                                        return false;
                                    }

                                    return true;
                                }
                            }">
                        <div class="input-group-append">
                            <span class="input-group-text" data-bind="click: function() { $vm.hasFocus(true); }">
                                <i class="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="list-group-container" data-bind="
                    css: {
                        'focus': $vm.hasFocus(),
                        'is-invalid': $vm.isInvalid()
                    },
                    style: { 
                        'height': (ko.toJS($vm.rows) * 36 + 1) + 'px' 
                    }">
                    <ul class="list-group" data-bind="foreach: { data: ($vm.keyword(), $vm.filter()), as: 'option' }">
                        <!-- ko let: { _id: $vm.$id() } -->
                            <li class="list-group-item" data-bind="css: {
                                    'hover': ($vm.focus(), $vm.hover(option)),
                                    'active': ($vm.selectedOptions(), $vm.checked(option)),
                                    'disabled': !!option['disabled']
                                }">
                                <label class="form-check-label" data-bind="css: {
                                    'disabled': !!option['disabled']
                                }, attr: {
                                    for: _id
                                }">
                                    <input class="form-check-input" tabindex="-1"
                                        data-bind="
                                            checked: $vm.selectedOptions,
                                            checkedValue: option,
                                            attr: {
                                                id: _id,
                                                type: $type,
                                                name: $vm.$name,
                                                disabled: !!option['disabled']
                                            },
                                            event: {
                                                focus: function() {
                                                    $vm.hasFocus(true);
                                                },
                                                change: function() {
                                                    $vm.hasFocus(true);
                                                    return true;
                                                }
                                            },
                                            css: {
                                                'd-none': $vm.$TYPE.SINGLE == $type
                                            }">
                                        <content id="template"></content>
                                </label>
                            </li>
                        <!-- /ko -->
                    </ul>
                </div>
            <!-- /ko -->
            <!-- ko if: $vm.$MODE.SELECTION == $mode -->
                <div class="selection-container">
                    <div class="form-group dropdown" data-bind="css: {
                            'focus': $vm.hasFocus(),
                            'is-invalid': $vm.isInvalid()
                        }">
                        <div class="form-control dropdown-toggle" data-bind="
                            css: {
                                'not-require': !ko.toJS($vm.configs.require)
                            },
                            click: function(data, $event) { 
                                $vm.hasFocus(true);
                                $vm.isShowDropdown(true);
                            }">
                            <!-- ko if: !ko.toJS($vm.configs.require) -->
                            <i class="fa fa-remove" data-bind="click: function() { 
                                $vm.isShowDropdown(false);
                                $vm.selectedOptions(undefined);
                                
                                return false;
                            }"></i>
                            <!-- /ko -->
                            <div class="form-check-label" data-bind="with: $vm.selectedOptions">
                                <!-- ko let: { option: $data } -->
                                    <content id="template"></content>
                                <!-- /ko -->
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-menu" data-bind="style: {
                            height: $vm.isShowDropdown() ? 'auto' : '0',
                            'border-width': $vm.isShowDropdown() ? '1px' : '0'
                        }">
                        <div class="form-group">
                            <input type="text" class="form-control" data-bind="
                                value: $vm.keyword,
                                valueUpdate: 'afterkeydown',
                                hasFocus: $vm.hasFocus,
                                attr: { 
                                    tabindex: 0 
                                },
                                event: {
                                    keydown: function($vm, $event) {
                                        if($event.keyCode == 13) {
                                            if($vm.isShowDropdown()) {
                                                $vm.isShowDropdown(false);
                                            } else {
                                                $vm.isShowDropdown(true);
                                            }
                                        }

                                        if([13, 38, 40].indexOf($event.keyCode) > -1) {
                                            $vm.keydown.bind($vm, $event)();
                                            return false;
                                        }

                                        if($event.keyCode == 27) {
                                            $vm.isShowDropdown(false);
                                            return false;
                                        }

                                        if($event.keyCode != 9 && !$vm.isShowDropdown()) {
                                            $vm.isShowDropdown(true);
                                            return false;
                                        }

                                        return true;
                                    }
                                }">
                        </div>
                        <div class="list-group-container" data-bind="
                                style: { 
                                    'height': (ko.toJS($vm.rows) * 36 + 1) + 'px' 
                                }">
                            <ul class="list-group" data-bind="foreach: { data: ($vm.keyword(), $vm.filter()), as: 'option' }">
                                <!-- ko let: { _id: $vm.$id() } -->
                                    <li class="list-group-item" data-bind="css: {
                                            'hover': ($vm.focus(), $vm.hover(option)),
                                            'active': ($vm.selectedOptions(), $vm.checked(option)),
                                            'disabled': !!option['disabled']
                                        }">
                                        <label class="form-check-label" data-bind="css: {
                                            'disabled': !!option['disabled']
                                        }, attr: {
                                            for: _id
                                        }">
                                            <input class="form-check-input d-none" tabindex="-1"
                                                data-bind="
                                                    checked: $vm.selectedOptions,
                                                    checkedValue: option,
                                                    attr: {
                                                        id: _id,
                                                        type: $type,
                                                        name: $vm.$name,
                                                        disabled: !!option['disabled']
                                                    },
                                                    event: {
                                                        focus: function() {
                                                            $vm.hasFocus(true);
                                                        }
                                                    }">
                                            <content id="template"></content>
                                        </label>
                                    </li>
                                <!-- /ko -->
                            </ul>
                        </div>
                    </div>
                </div>
            <!-- /ko -->
        </div>
    </div>
    `
})
export class SelectionComponent extends BaseComponentControl {
    keyword: KnockoutObservable<string> = ko.observable('');
    options: KnockoutObservableArray<any> = ko.observableArray([]);
    selectedOptions: KnockoutObservableArray<any> = ko.observableArray([]);

    rows: KnockoutObservable<number> = ko.observable(0);
    value: KnockoutObservable<any> = ko.observable({});
    focus: KnockoutObservable<any> = ko.observable(undefined);

    // input focus
    hasFocus: KnockoutObservable<boolean> = ko.observable(false);
    isInvalid: KnockoutObservable<boolean> = ko.observable(false);

    // show dropdown
    isShowDropdown: KnockoutObservable<boolean> = ko.observable(false);

    constructor(params: IParamConstructor, private element: HTMLElement) {
        super(params as IBaseParamConstructor, element);

        let self = this,
            configs = self.configs as IConfigs;

        ko.utils.extend(self, {
            $TYPE: TYPE,
            $MODE: MODE
        });

        ko.utils.extend(configs, {
            mode: ko.observable(MODE.RADIO),
            type: ko.observable(TYPE.SINGLE)
        });

        ko.computed({
            read: () => {
                configs!.mode!(ko.toJS(params.configs!.mode));
                configs!.type!(ko.toJS(params.configs!.type));
            }
        });

        ko.utils.extend(self, {
            options: params.options,
            selectedOptions: params.value
        });

        self.isShowDropdown.subscribe(s => {
            if (!s) {
                self.keyword('');
            }
        });

        self.options.subscribe(data => {
            if (!_.isEmpty(data) && self.selectedOptions.valueHasMutated) {
                self.selectedOptions.valueHasMutated();
            }
        });

        self.selectedOptions.subscribe((data: Array<any>) => {
            /*if (self.label && self.label.configs && self.label.configs.css) {
                if (_.isEmpty(data)) {
                    let configs: IConfigs = ko.toJS(self.configs),
                        require: boolean = ko.toJS(configs.require) || false;

                    if (require) {
                        self.isInvalid(true);
                        self.label.configs.css('text-danger');
                    } else {
                        self.isInvalid(false);
                        self.label.configs.css('');
                    }
                } else {
                    self.isInvalid(false);
                    self.label.configs.css('');
                }
            }*/
        });

        self.options.subscribe(options => {
            let rows: number = _.min([6, _.size(options)]) || 6;
            self.rows(rows);
        });

        /*if (_.isEqual(ko.toJS(self.configs.type), TYPE.MULTIPLE) && _.isEqual(ko.toJS(self.configs.mode), MODE.LISTBOX)) {
            new Selectables({
                zone: element.querySelector('ul.list-group'),
                elements: 'li',
                selectedClass: 'nts-selected',
                onSelect: function (elements: Array<HTMLElement>) {
                    let sm = !!_.find(elements, e => {
                        let input: HTMLInputElement = element.querySelector('input') as HTMLInputElement;

                        if (input) {
                            return input.checked;
                        }
                        return false;
                    });

                    _.each(elements, element => {
                        let input: HTMLInputElement = element.querySelector('input') as HTMLInputElement;

                        if (input) {
                            if (sm) {
                                if (!input.checked) {
                                    input.click();
                                }
                            } else {
                                input.click();
                            }
                        }
                    });
                }
            });
        }*/
    }

    filter = () => {
        let self = this,
            keyword = ko.toJS(self.keyword);

        return _.filter(self.options(), opt => _.includes(_.toUpper(opt['name']), _.toUpper(keyword)));
    };

    hover = (value: any) => {
        let self = this;

        return _.isEqual(ko.toJS(self.focus), value);
    }

    checked = (value: any) => {
        let self = this,
            configs = self.configs as IConfigs,
            values: Array<any> = [];

        if (!value) {
            return false;
        }

        if (_.isEqual(ko.toJS(configs!.type), TYPE.SINGLE)) {
            values = _([ko.toJS(self.selectedOptions)]).filter(m => m).value();
        } else {
            values = _(ko.toJS(self.selectedOptions)).map(m => m).filter(m => m).value();
        }

        return _.findIndex(values, v => v["id"] == value["id"]) > -1;
    }

    keydown = (event: KeyboardEvent) => {
        let self = this,
            scroll = false,
            focus = ko.toJS(self.focus),
            options = self.filter(),
            configs = self.configs as IConfigs,
            hasEnable = !!_(options).filter(opt => !opt['disabled']).size();

        if (_.isEqual(ko.toJS(configs!.type), TYPE.SINGLE) && _.isEmpty(focus)) {
            focus = self.selectedOptions();
        }

        if (self.element) {
            let containerScroll: HTMLElement = self.element.getElementsByClassName('list-group-container')[0] as HTMLElement,
                scrollTop = containerScroll.scrollTop,
                index = Math.floor(scrollTop / 36);

            // enter or space
            if ([13, 32].indexOf(event.keyCode) > -1) {
                if (self.element) {
                    let hover = self.element.querySelector('.hover label') as HTMLElement;
                    if (hover) {
                        hover.click();
                        event.preventDefault();
                    }
                }
            }
            // left or up
            if ([37, 38].indexOf(event.keyCode) > -1) {
                scroll = false;

                if (focus) {
                    do {
                        let index = _.findIndex(options, ['id', focus['id']]) - 1;

                        if (index < 0) {
                            index = _.size(options) - 1;
                            scroll = true;
                        }

                        focus = options[index];
                    } while (!_.isNil(focus['disabled']) && !focus['disbaled'] && hasEnable)

                    self.focus(focus);
                }
                else {
                    do {
                        if (index < 0) {
                            index = _.size(options) - 1;
                        }

                        focus = options[index];
                    } while (!_.isNil(focus['disabled']) && !focus['disbaled'] && hasEnable)

                    self.focus(focus);
                }
            }
            // right or down
            if ([39, 40].indexOf(event.keyCode) > -1) {
                scroll = true;

                if (focus) {
                    do {
                        let index = _.findIndex(options, ['id', focus['id']]) + 1;

                        if (index > _.size(options) - 1) {
                            index = 0;
                            scroll = false;
                        }

                        focus = options[index];
                    } while (!_.isNil(focus['disabled']) && !focus['disbaled'] && hasEnable)

                    self.focus(focus);
                }
                else {
                    do {
                        if (index > _.size(options) - 1) {
                            index = 0;
                            scroll = false;
                        }

                        focus = options[index];
                    } while (!_.isNil(focus['disabled']) && !focus['disbaled'] && hasEnable)

                    self.focus(focus);
                }
            }

            if (_.isEqual(ko.toJS(configs!.type), TYPE.SINGLE)) {
                self.selectedOptions(self.focus());
            }

            self.scroll(scroll);
        }
    }

    // scroll to focus option
    scroll = (scrollDown: boolean = false) => {
        let self = this,
            focus = ko.toJS(self.focus) || ko.toJS(self.value);

        if (_.isArray(focus)) {
            focus = _.head(focus);
        }

        if (self.element) {
            let containerScroll: HTMLElement = self.element.getElementsByClassName('list-group-container')[0] as HTMLElement,
                scrollTo: HTMLElement = containerScroll.getElementsByClassName('hover')[0] as HTMLElement;

            if (containerScroll && scrollTo) {
                if (scrollDown) {
                    if (scrollTo.offsetTop >= containerScroll.scrollTop + containerScroll.offsetHeight - 36) {
                        containerScroll.scrollTop = scrollTo.offsetTop - containerScroll.offsetHeight + 37;
                    }
                } else {
                    if (scrollTo.offsetTop < containerScroll.scrollTop) {
                        containerScroll.scrollTop = scrollTo.offsetTop - 1;
                    }
                }
            }
        }
    }
}

interface IParamConstructor {
    value: KnockoutObservable<any>;
    key: KnockoutObservable<string>;
    rows: KnockoutObservable<number>;
    text: KnockoutObservable<string>;
    options: KnockoutObservableArray<any>;
    configs: IConfigs;
}

interface IConfigs extends IBaseConfigs {
    type: KnockoutObservable<TYPE>;
    mode?: KnockoutObservable<MODE>;
}

enum TYPE {
    SINGLE = <any>"radio",
    MULTIPLE = <any>"checkbox"
}

enum MODE {
    RADIO = <any>"radio",
    BUTTON = <any>"button",
    LISTBOX = <any>"listbox",
    CHECKBOX = <any>"checkbox",
    SELECTION = <any>"selection"
}