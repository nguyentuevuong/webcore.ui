import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common/ko';

@component({
    url: 'sample/documents/style',
    icon: 'fa fa-cogs',
    title: '#style',
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|documents': 'Documents'
        },
        'vi': {
            'sample|documents': 'Tài liệu hướng dẫn'
        }
    }
})
export class StyleDocumentViewModel {

}