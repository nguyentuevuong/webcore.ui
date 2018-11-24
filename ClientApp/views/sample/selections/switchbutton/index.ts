import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/selection/switch',
    title: '#switch',
    icon: 'fa fa-toggle-down',
    template: require('./index.html'),
    resources: {
        'en': {
        },
        'vi': {
        }
    }
})
export class SampleSwitchViewModel {
    constructor(params: any, element: HTMLElement) {
    }
}