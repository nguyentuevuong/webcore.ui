import * as ko from 'knockout';
import * as $ from 'jquery';

import { component } from '@app/common/ko';

@component({
    url: 'sample/selection/radiobox',
    title: '#radiobox',
    icon: 'fa fa-toggle-down',
    template: require('./index.html'),
    resources: {
        'en': {
        },
        'vi': {
        }
    }
})
export class SampleRadioboxViewModel {
    constructor(params: any, element: HTMLElement) {
    }
}