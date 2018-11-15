import * as ko from 'knockout';

import {component} from '@app/common/ko';

@component({
    url: 'sample/date-picker',
    icon: 'fa fa-calendar',
    title: 'Date picker',
    styles: require('./style.scss'),
    template: require('./date-picker.html')
})
export class DatePickerViewModel {
}