import { ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/wizard',
    name: 'sample-wizard',
    title: 'Step wizard',
    icon: 'fa fa-refresh',
    //styles: require('./style.scss'),
    template: require('./index.html')
})
export class SampleWizardViewModel {
    private step: KnockoutObservable<string> = ko.observable('#step_2');
    private html: string = html;
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