import { component, IView, IDispose } from '@app/common/ko';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

@component({
    url: 'sample/employee/:id:',
    name: 'employee',
    title: 'Employee manager',
    icon: 'fa fa-users',
    styles: require('./employee.css'),
    template: require('./employee.html')
})
export class SampleEmployeeViewModel implements IView, IDispose {
    dispose(): void {
        console.log("Class disposed.");
    }
    afterRender(): void {
        console.log("UI renderred.");
    }
    genders: KnockoutObservableArray<IData> = ko.observableArray([]);
    positions: KnockoutObservableArray<IData> = ko.observableArray([]);
    departments: KnockoutObservableArray<IData> = ko.observableArray([]);

    employee: KnockoutObservable<Employee> = ko.observable(new Employee());
    employees: KnockoutObservableArray<IEmployee> = ko.observableArray([]);

    constructor(params: IParam, element: HTMLElement) {
        let self = this,
            employee = self.employee();

        employee._raw.subscribe((key: IEmployee | undefined) => {
            let genders: Array<IData> = self.genders(),
                positions: Array<IData> = self.positions(),
                departments: Array<IData> = self.departments();

            employee.id(key!.id);
            employee.name(key!.name);
            employee.gender(_.find(genders, g => g.id == key!.gender));
            employee.position(_.find(positions, g => g.id == key!.position));

            employee.department(_.find(departments, d => d.id == key!.department));

            employee.memo(key!.memo);
        });

        $.getJSON('/json/gender.json', {}, self.genders);
        $.getJSON('/json/position.json', {}, self.positions);
        $.getJSON('/json/department.json', {}, self.departments);

        $.getJSON('/json/employee.json', {}, (data: Array<IEmployee>) => {
            self.employees(data);

            if (_.isNil(params.id)) {
                employee._raw(_.first(data));
            } else {
                let id = Number(params.id);

                if (_.isNumber(id)) {
                    let emp = _.find(data, (d: IEmployee) => d.id == id);

                    if (!_.isNil(emp)) {
                        employee._raw(emp);
                    } else {
                        employee._raw(_.first(data));
                    }
                }
            }
        });
    }

    saveData = () => {
        let self = this,
            employee: IEmployee = ko.toJS(self.employee),
            employees: Array<IEmployee> = self.employees(),
            update: IEmployee | undefined = _.find(employees, (emp: IEmployee) => emp.id == ko.toJS(emp.id));

        if (_.isNil(update)) {
            employees.push({
                id: employee.id,
                name: employee.name,
                gender: (employee.gender as IData).id,
                position: (employee.position as IData).id,
                department: (employee.department as IData).id,
                memo: employee.memo
            });

            self.employees(employees);
        } else {
            _.each(employees, emp => {
                if (_.isEqual(emp.id, employee.id)) {
                    _.update(emp, ["name"], () => employee.name);
                    _.update(emp, ["gender"], () => (employee.gender as IData).id);
                    _.update(emp, ["position"], () => (employee.position as IData).id);
                    _.update(emp, ["department"], () => (employee.department as IData).id);
                    _.update(emp, ["memo"], () => employee.memo);
                }
            });

            self.employees.valueHasMutated!();
        }

        self.employee()._raw.valueHasMutated!();
    }
}

interface IParam {
    id?: string;
}

interface IData {
    id: number;
    name: string;
}

interface IEmployee {
    id: number;
    name: string;
    gender: IData | number;
    position: IData | number;
    department: IData | number;
    memo?: string;
}

class Employee {
    _raw: KnockoutObservable<IEmployee | undefined> = ko.observable();

    id: KnockoutObservable<number | undefined> = ko.observable();
    name: KnockoutObservable<string | undefined> = ko.observable();

    gender: KnockoutObservable<IData | undefined> = ko.observable();
    position: KnockoutObservable<IData | undefined> = ko.observable();
    department: KnockoutObservable<IData | undefined> = ko.observable();

    memo: KnockoutObservable<string | undefined> = ko.observable();
}