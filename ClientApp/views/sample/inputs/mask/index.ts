import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/input/mask',
    name: 'controls-mask',
    title: '#mask',
    icon: 'fa fa-hashtag',
    template: require('./index.html')
})
export class SampleMaskBindingViewModel {
    mask: KnockoutObservableDate = ko.observableDate();

    constructor() {
        this.mask(new Date());
    }
}