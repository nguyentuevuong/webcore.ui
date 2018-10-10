import { component } from '@app/common/ko';
import * as ko from 'knockout';

@component({
    url: 'sample/input/mask',
    name: 'controls-mask',
    title: 'Mask bindings',
    icon: 'fa fa-thumbs-o-up',
    template: require('./index.html')
})
export class SampleMaskBindingViewModel {
    mask: KnockoutObservableDate = ko.observableDate();

    constructor() {
        this.mask(new Date());
    }
}