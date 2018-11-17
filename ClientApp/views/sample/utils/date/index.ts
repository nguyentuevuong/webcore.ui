import { component } from '@app/common/ko';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

@component({
    url: 'sample/utils/date',
    name: 'utils-date',
    title: 'utils_date',
    icon: 'fa fa-calendar',
    //styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|uis': 'Icons & colors',
            'color_system': 'Color system'
        },
        'vi': {
            'sample|uis': 'Biểu tượng & màu sắc',
            'color_system': 'Màu sắc hệ thống'
        }
    }
})
export class DateUtilsViewModel {
}