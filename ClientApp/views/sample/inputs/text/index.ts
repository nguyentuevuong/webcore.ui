import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common/ko';

@component({
    url: 'sample/input/text',
    icon: 'fa fa-cogs',
    title: 'String input',
    template: require('./index.html'),
})
export class SampleInputTextViewModel {

}