import * as ko from 'knockout';
import * as $ from 'jquery';

import { component } from '@app/common/ko';

@component({
    url: 'sample/selection/checkbox',
    title: '#checkbox',
    icon: 'fa fa-toggle-down',
    template: require('./index.html'),
    resources: {
        'en': {
        },
        'vi': {
        }
    }
})
export class SampleCheckboxViewModel {
    constructor(params: any, element: HTMLElement) {
    }
}