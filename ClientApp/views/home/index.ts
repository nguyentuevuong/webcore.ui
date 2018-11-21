import { ko } from '@app/providers';
import { fetch } from '@app/common/http';
import { md } from '@app/common/utils';

import { component, IView, IDispose } from '@app/common/ko';

@component({
    url: '/',
    icon: 'fa fa-home',
    title: '#home',
    styles: require('./style.scss'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class HomeViewModel implements IView, IDispose {
    status: KnockoutObservable<string | undefined> = ko.observable('pending');
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, private element: HTMLElement) {
        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.listEmployee(data.response);
        });
    }

    dispose(): void {
        console.log("Home view disposed!");
    }

    afterRender(): void {
        console.log("Home view renderred!");
    }
}