import * as ko from 'knockout';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { component } from 'common';

@component({
    url: '',
    icon: 'fa fa-home',
    title: '#home',
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class HomeViewModel {
    status: KnockoutObservable<string | undefined> = ko.observable('pending');
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor() {
        $.getJSON('/json/employee.json', {}, this.listEmployee)
    }
}