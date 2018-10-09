import * as ko from 'knockout';

import { component } from '@app/common/ko';

@component({
    url: 'sample/barcode',
    title: '#barcode',
    icon: 'fa fa-css3',
    template: require('./index.html'),
    resources: {
        'en': {
            'barcode': 'Barcode'
        },
        'vi': {
            'barcode': 'Mã vạch'
        }
    }
})
export class BarCodeSampleViewModel {
    barcode: KnockoutObservable<string> = ko.observable('');
}