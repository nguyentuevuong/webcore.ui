import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/navigate/tab',
    name: 'sample-tab',
    title: '#tab',
    icon: 'fa fa-refresh',
    //styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|navigate': 'Navigate controls'
        }, 'vi': {
            'sample|navigate': 'Điểu khiển điều hướng'
        }
    }
})
export class SampleTabViewModel {
    constructor(params: any, private element: HTMLElement) {
    }
}