import { ko } from '@app/providers';
import { fetch } from '@app/common/http';

import { component } from '@app/common/ko';

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
        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.listEmployee(data.response);
        });
    }
}