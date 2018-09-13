import { ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'tabs',
    template: `
    <!-- ko foreach: $vm.tabs -->
    <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link"
            data-bind=" i18n: $data,
                        click: $vm.selected.bind($data),
                        css: {
                            'active': ko.toJS($vm.selected) == $data
                        }"></a>
    </li>
    <!-- /ko -->`
})
export class TabComponent {
    selected: KnockoutObservable<string> = ko.observable('#step_1');
    tabs: KnockoutObservableArray<string> = ko.observableArray(['#step_0', '#step_1', '#step_2', '#step_3', '#finish']);
    disableds: KnockoutObservableArray<string> = ko.observableArray([]);

    constructor(params: IParams, element: HTMLElement) {
        let self = this;

        if (params.tabs) {
            if (ko.isObservable(params.tabs)) {
                ko.utils.extend(self, {
                    steps: params.tabs
                });
            } else {
                self.tabs(ko.toJS(params.tabs));
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

        if (params.disableds) {
            if (ko.isObservable(params.disableds)) {
                ko.utils.extend(self, {
                    disableds: params.disableds
                });
            } else {
                self.disableds(ko.toJS(params.disableds));
            }
        }
    }
}

interface IParams {
    tabs: KnockoutObservableArray<string>;
    selected: KnockoutObservable<string>;
    disableds: KnockoutObservableArray<string>;
}