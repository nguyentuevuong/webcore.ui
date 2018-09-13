import { ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'wizard',
    template: `<div class="wizard noselect" data-bind="init: {
                $config: ko.toJS($vm.configs)
            }">
        <div class="header">
            <div class="img">
                <i data-bind="css: $config.icon || 'fas fa-cogs'"></i>
            </div>
            <h5 data-bind="i18n:$config.title"></h5>
        </div>
        <ul class="step-list list-group" data-bind="foreach: $vm.steps">
            <li class="list-group-item" data-bind="i18n: $data, css: { 'active': ko.toJS($vm.selected) == $data }, click: $vm.selectStep.bind($vm, $data)"></li>
        </ul>
        <!-- ko if: ko.toJS($config.showFooter) -->
        <div class="footer btn-group">
            <button class="btn btn-link" data-bind="click: $vm.previewStep.bind($vm), enable: $vm.previewStep.enable">
                <i class="fas fa-arrow-circle-left"></i>
                <span data-bind="i18n: '#wizard_back'"></span>
            </button>
            <button class="btn btn-link" data-bind="click: $vm.forwardStep.bind($vm), enable: $vm.forwardStep.enable">
                <span data-bind="i18n: '#wizard_forward'"></span>
                <i class="fas fa-arrow-circle-right"></i>
            </button>
        </div>
        <!-- /ko -->
    </div>`
})
export class WizardComponent {
    selected: KnockoutObservable<string> = ko.observable('#step_1');
    steps: KnockoutObservableArray<string> = ko.observableArray(['#step_0', '#step_1', '#step_2', '#step_3', '#finish']);
    disableds: KnockoutObservableArray<string> = ko.observableArray([]);

    configs: IConfigs = {
        icon: ko.observable('fa fa-cogs'),
        title: ko.observable('#notitle'),
        showFooter: ko.observable(false),
        selectable: ko.observable(false)
    };

    constructor(params: IParam, element: HTMLElement) {
        let self = this;

        if (params.steps) {
            if (ko.isObservable(params.steps)) {
                ko.utils.extend(self, {
                    steps: params.steps
                });
            } else {
                self.steps(ko.toJS(params.steps));
            }
        }

        if (params.selected) {
            if (ko.isObservable(params.selected)) {
                ko.utils.extend(self, {
                    selected: params.selected
                });
            } else {
                self.selected(ko.toJS(params.selected));
            }
        }

        ko.utils.extend(self.previewStep, {
            enable: ko.computed(() => {
                let $step: string = ko.toJS(self.selected),
                    $steps: Array<string> = ko.toJS(self.steps);

                return $steps.indexOf($step) > 0;
            })
        });

        ko.utils.extend(self.forwardStep, {
            enable: ko.computed(() => {
                let $step: string = ko.toJS(self.selected),
                    $steps: Array<string> = ko.toJS(self.steps);

                return $steps.indexOf($step) < $steps.length - 1;
            })
        });

        if (params.disableds) {
            if (ko.isObservable(params.disableds)) {
                ko.utils.extend(self, {
                    disableds: params.disableds
                });
            } else {
                self.disableds(ko.toJS(params.disableds));
            }
        }

        if (params.configs) {
            let scs: IConfigs = self.configs,
                pcs: IConfigs = ko.unwrap(params.configs);

            if (pcs.icon && ko.isObservable(scs.icon)) {
                if (ko.isObservable(pcs.icon)) {
                    ko.utils.extend(scs, {
                        icon: pcs.icon
                    });
                } else {
                    scs.icon(ko.toJS(pcs.icon));
                }
            }

            if (pcs.title && ko.isObservable(scs.title)) {
                if (ko.isObservable(pcs.title)) {
                    ko.utils.extend(scs, {
                        title: pcs.title
                    });
                } else {
                    scs.title(ko.toJS(pcs.title));
                }
            }

            if (pcs.showFooter && ko.isObservable(scs.showFooter)) {
                if (ko.isObservable(pcs.showFooter)) {
                    ko.utils.extend(scs, {
                        showFooter: pcs.showFooter
                    });
                } else {
                    scs.showFooter(ko.toJS(pcs.showFooter));
                }
            }

            if (pcs.selectable && ko.isObservable(scs.selectable)) {
                if (ko.isObservable(pcs.selectable)) {
                    ko.utils.extend(scs, {
                        selectable: pcs.selectable
                    });
                } else {
                    scs.selectable(ko.toJS(pcs.selectable));
                }
            }
        }
    }

    selectStep = (step: string) => {
        let self = this,
            selectable: boolean = ko.toJS(self.configs.selectable);

        if (selectable) {
            self.selected(step);
        }
    }

    previewStep = () => {
        let self = this,
            step: string = ko.toJS(self.selected),
            steps: Array<string> = ko.toJS(self.steps),
            index: number = steps.indexOf(step);

        self.selected(steps[--index]);
    }

    forwardStep = () => {
        let self = this,
            step: string = ko.toJS(self.selected),
            steps: Array<string> = ko.toJS(self.steps),
            index: number = steps.indexOf(step);

        self.selected(steps[++index]);
    }
}


interface IParam {
    selected: KnockoutObservable<string> | string;
    steps: KnockoutObservableArray<string> | Array<string>;
    disableds?: KnockoutObservableArray<string> | Array<string>;
    configs: IConfigs
}

interface IConfigs {
    icon: KnockoutObservable<string> | string;
    title: KnockoutObservable<string> | string;
    showFooter: KnockoutObservable<boolean> | boolean;
    selectable: KnockoutObservable<boolean> | boolean;
}