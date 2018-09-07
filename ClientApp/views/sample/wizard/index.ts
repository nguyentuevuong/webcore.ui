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
    private step: KnockoutObservable<number> = ko.observable(0);
    private html: string = html;
}


const html = `<div data-bind="wizard: {
    step: $vm.step,
    icon: 'fa fa-users',
    title: '#title_wizard',
    steps: ['#step_1', '#step_2', '#step_3', '#step_4', '#step_5', '#step_6', '#step_finish'],
    showFooter: true,
    selectable: true
}" class="wizard noselect"></div>`