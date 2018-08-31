import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common';

@component({
    url: 'sample/index',
    icon: 'fa fa-cogs',
    title: 'Index page',
    template: require('./index.html')
})
export class SampleIndexViewModel {

}