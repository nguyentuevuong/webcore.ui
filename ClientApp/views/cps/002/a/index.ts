import * as $ from 'jquery';
import * as ko from 'knockout';

import { component } from '@app/common/ko';

@component({
    url: '/employee/create',
    title: '#cps001_title',
    icon: 'fa fa-globe',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class Cps002aViewModel {
    step: KnockoutObservable<string> = ko.observable('#step_1');
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, private element: HTMLElement) {
        $.getJSON('/json/employee.json', {}, this.listEmployee)
    }

    preventLog(abc: string) {
        $(this.element).find('#log').append($('<pre>', { text: abc + ': ' + new Date().getTime() }))
    }

    preview() {
        let self = this;

        self.step('#step_2');
    }

    next() {
        let self = this;

        self.step('#step_1');
    }
}