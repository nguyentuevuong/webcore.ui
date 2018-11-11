import { component, IView, IDispose } from '@app/common/ko';

@component({
    url: '/sample/documents/markdown',
    icon: 'fa fa-home',
    title: '#markdown',
    template: require('./index.html'),
    resources: {

    }
})
export class SampleMarkdownViewModel implements IView, IDispose {
    content: string = require('./content.txt');

    constructor() {
    }

    dispose(): void {
    }

    afterRender(): void {
    }
}