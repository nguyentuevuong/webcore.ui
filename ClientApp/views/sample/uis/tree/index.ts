import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/tree',
    name: 'sample-tree',
    title: 'Tree control',
    icon: 'fa fa-refresh',
    //styles: require('./style.scss'),
    template: require('./index.html')
})
export class SampleTreeViewModel {
    constructor(params: any, private element: HTMLElement) {
    }
}