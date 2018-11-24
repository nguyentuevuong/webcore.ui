import { ko } from '@app/providers';
import { fetch } from '@app/common/utils';
import { component } from '@app/common/ko';

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
        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.listEmployee(data.response);
        });
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