import * as ko from 'knockout';
import * as $ from 'jquery';

import { component } from '../../../../common';

@component({
    name: 'cps001-tab',
    styles: `.tab-content {
    }`,
    template: `<ul class="nav nav-tabs noselect">
        <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#home">Layout</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#profile">Category</a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active" id="home">
            <ul class="list-group noselect" data-bind="sortable: $vm.listEmployee">
                <li class="list-group-item d-flex justify-content-between align-items-center" data-bind="text: ko.toJS($data).name">
                </li>
            </ul>
        </div>
        <div class="tab-pane fade" id="profile">
            <ul class="list-group noselect" data-bind="sortable: $vm.listEmployee">
                <li class="list-group-item d-flex justify-content-between align-items-center" data-bind="text: ko.toJS($data).name">
                </li>
            </ul>
        </div>
    </div>`
})
export class Cps001aTabComponent {

    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, element: HTMLElement) {
        $.getJSON('/json/employee.json', {}, this.listEmployee);
    }
}