import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';
import '@app/common/utils/microhighlight';

@component({
    url: 'sample/documents/hightlight',
    icon: 'fa fa-cogs',
    title: '#style',
    styles: require('./style.scss'),
    template: require('./index.html')
})
export class HighLightDocumentViewModel {

}