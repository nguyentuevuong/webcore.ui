import * as ko from 'knockout';
import * as $ from 'jquery';
import { component } from '../../../../decorator/component';

@component({
    url: 'sample/selection/listbox',
    title: 'Listbox',
    icon: 'fa fa-list',
    styles: require('./listbox.css'),
    template: require('./listbox.html')
})
class SampleListboxViewModel {
    employee: KnockoutObservable<Employee> = ko.observable(new Employee());
    employees: KnockoutObservableArray<IEmployee> = ko.observableArray([]);

    constructor(params: any, element: HTMLElement) {
        let self = this;

        $.getJSON('/json/employee.json', {}, self.employees);
    }
}

interface IEmployee {
    id: number;
    name: string;
}

class Employee {
    id: KnockoutObservable<number> = ko.observable(-1);
    name: KnockoutObservable<string> = ko.observable('');
}