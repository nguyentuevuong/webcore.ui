import { _, ko } from '@app/providers';
import { fetch } from '@app/common/utils';
import { component } from '@app/common/ko';

@component({
    name: 'modal-child-2',
    icon: 'fa fa-window-maximize',
    title: 'Employees',
    template: require('./modal.childrent.2.html')
})
export class SampleModalChildrent2ViewModel {
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);
    constructor() {

        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.listEmployee(data.response);
        });
    }

    afterRender = () => {
        let self = this;
    }

    getData() {
    }
}