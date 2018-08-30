import * as ko from 'knockout';
import * as $ from 'jquery';
import { component } from '../../../../common/component';

@component({
    url: 'sample/selection/dropdown',
    title: 'Dropdown list',
    icon: 'fa fa-toggle-down',
    styles: require('./dropdown.css'),
    template: require('./dropdown.html')
})
class SampleDropdownViewModel {
    employee: KnockoutObservable<IEmployee | undefined> = ko.observable(undefined);
    employees: KnockoutObservableArray<IEmployee> = ko.observableArray([]);
    text: KnockoutObservable<string> = ko.observable('Chọn một nhân viên');
    require: KnockoutObservable<boolean> = ko.observable(false);
    constructor(params: any, element: HTMLElement) {
        let self = this;

        $.getJSON('/json/employee.json', {}, self.employees);

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