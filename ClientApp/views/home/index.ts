import * as ko from 'knockout';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { component, IView, IDispose } from '@app/common/ko';

@component({
    url: '/',
    icon: 'fa fa-home',
    title: '#home',
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class HomeViewModel implements IView, IDispose {
    status: KnockoutObservable<string | undefined> = ko.observable('pending');
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor() {
        $.getJSON('/json/employee.json', {}, this.listEmployee)
    }

    dispose(): void {
        console.log("Home view disposed!");
    }

    afterRender(): void {
        console.log("Home view renderred!");
    }
}