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
}