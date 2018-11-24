import { ko } from '@app/providers';
import { fetch } from '@app/common/utils';

import { component } from '@app/common/ko';

@component({
    url: 'sample/selection/dropdown',
    title: 'Dropdown list',
    icon: 'fa fa-toggle-down',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|selection': 'Selections'
        },
        'vi': {
            'sample|selection': 'Điều khiển dạng chọn'
        }
    }
})
class SampleDropdownViewModel {
    employee: KnockoutObservable<IEmployee | undefined> = ko.observable(undefined);
    employees: KnockoutObservableArray<IEmployee> = ko.observableArray([]);
    text: KnockoutObservable<string> = ko.observable('Chọn một nhân viên');
    require: KnockoutObservable<boolean> = ko.observable(false);
    constructor(params: any, element: HTMLElement) {
        let self = this;

        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            self.employees(data.response);
        });

        self.employees.subscribe((data: Array<IEmployee>) => {
            self.employee(data[0]);
        });
    }

    change = () => {
        let self = this;
        self.text('Changed text');
        
        self.employee!(self.employees()[3]);
        self.require(true);
    }
}

interface IEmployee {
    id: number;
    name: string;
}