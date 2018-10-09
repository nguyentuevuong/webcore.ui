import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/selection/tree',
    name: 'sample-tree',
    title: '#tree',
    icon: 'fa fa-refresh',
    //styles: require('./style.scss'),
    template: require('./index.html')
})
export class SampleTreeViewModel {
    constructor(params: any, private element: HTMLElement) {
    }
}