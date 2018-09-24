import * as ko from 'knockout';

import { component } from '@app/common/ko';

@component({
    url: 'sample/barcode',
    title: '#barcode',
    icon: 'fa fa-css3',
    template: require('./index.html')
})
export class BarCodeSampleViewModel {
    barcode: KnockoutObservable<string> = ko.observable('');
}