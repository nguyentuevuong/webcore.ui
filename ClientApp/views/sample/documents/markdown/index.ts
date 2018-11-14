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
    contents: { [key: string]: string } = {
        en: require('./contents/en.md'),
        vi: require('./contents/vi.md')
    };

    constructor() {
    }

    dispose(): void {
    }

    afterRender(): void {
    }
}