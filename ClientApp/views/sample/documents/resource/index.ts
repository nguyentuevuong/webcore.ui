import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common/ko';

@component({
    url: 'sample/documents/resource',
    icon: 'fa fa-cogs',
    title: '#resource',
    template: require('./index.html'),
    resources: {
        'en': {
        },
        'vi': {
        }
    }
})
export class ResourceDocumentViewModel {

}