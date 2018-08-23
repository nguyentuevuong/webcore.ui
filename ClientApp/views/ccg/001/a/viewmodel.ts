import * as $ from 'jquery';
import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    name: 'ccg-001',
    title: '#ccg_button',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class Ccg001aViewModel {
    _show: KnockoutObservable<string> = ko.observable('');

    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, element: HTMLElement) {
        $.getJSON('/json/employee.json', {}, this.listEmployee);
    }

    showPanel = () => {
        alert('clicked');
    }

    hidePanel = () => {
        let self = this,
            show: boolean = String(ko.toJS(self._show)).indexOf('slideOutLeft') > -1;

        self._show(show ? '' : 'show-2x');        
    }

    afterRender = () => {

    }
}