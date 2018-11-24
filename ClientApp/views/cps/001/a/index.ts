import { ko } from '@app/providers';
import { fetch } from '@app/common/utils';

import { component } from '@app/common/ko';

@component({
    url: '/employee/update-info/:id',
    title: '#cps001_title',
    icon: 'fa fa-globe',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class Cps001aViewModel {
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, private element: HTMLElement) {
        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.listEmployee(data.response);
        });

        console.log(params);
    }

    preventLog(abc: string) {
        let self = this,
            log = self.element.querySelector('#log');

        if (log) {
            ko.utils.setHtml(log, `<pre>${abc + new Date().getTime()}</pre>`);
        }
    }
}