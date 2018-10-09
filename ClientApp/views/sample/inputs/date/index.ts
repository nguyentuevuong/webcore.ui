import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common/ko';

@component({
    url: 'sample/input/date',
    icon: 'fa fa-cogs',
    title: 'Date input',
    template: require('./index.html'),
})
export class SampleInputDateViewModel {

}