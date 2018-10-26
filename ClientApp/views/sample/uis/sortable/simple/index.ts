import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/sortable/simple',
    name: 'sample-sortable-simple',
    title: 'Sortable control (simple)',
    icon: 'fa fa-refresh',
    styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|sortable': 'Sortables'
        },
        'vi': {
            'sample|sortable': 'Điều khiển sắp xếp'
        }
    }
})
export class SampleSortableSimpleViewModel {
    constructor(params: any, private element: HTMLElement) {
        let self = this;

    }
}