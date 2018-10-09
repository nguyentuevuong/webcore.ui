import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common/ko';

@component({
    url: 'sample/input/clock',
    icon: 'fa fa-cogs',
    title: 'Clock input',
    template: '',
    resources: {
        'en': {
            'sample|input': 'Input controls'
        },
        'vi': {
            'sample|input': 'Điều khiển dạng nhập'
        }
    }
})
export class SampleInputClockViewModel {

}