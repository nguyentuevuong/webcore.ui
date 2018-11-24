import { ko } from '@app/providers';
import { fetch } from '@app/common/utils';
import { component } from '@app/common/ko';

@component({
    url: 'sample/navigate/wizard',
    name: 'sample-wizard',
    title: '#wizard',
    icon: 'fa fa-refresh',
    //styles: require('./style.scss'),
    template: require('./index.html')
})
export class SampleWizardViewModel {
    public html: string = html;
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, private element: HTMLElement) {

        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.listEmployee(data.response);
        });
    }
}

const html = `<div data-bind="wizard: ['#step_1', '#step_2', '#step_3', '#step_4', '#step_5', '#step_6', '#step_finish'],
    selected: $vm.step,
    disableds: [],
    configs: {
        icon: 'fa fa-users',
        title: '#title_wizard',
        showFooter: false,
        selectable: true
    }"></div>`