import * as ko from 'knockout';
import * as _ from 'lodash';

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
        $.getJSON('/json/employee.json', {}, this.listEmployee)
    }

    afterRender = () => {
        let self = this;
    }

    getData() {
    }
}