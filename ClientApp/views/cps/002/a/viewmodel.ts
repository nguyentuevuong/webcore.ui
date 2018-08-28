import * as $ from 'jquery';
import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    url: '/create-employee',
    title: '#cps001_title',
    icon: 'fa fa-globe',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class Cps002aViewModel {
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, private element: HTMLElement) {
        $.getJSON('/json/employee.json', {}, this.listEmployee)
    }

    preventLog(abc: string) {
        $(this.element).find('#log').append($('<pre>', { text: abc + ': ' + new Date().getTime() }))
    }
}