import * as ko from 'knockout';

import {component} from '@app/common';

@component({
    url: 'sample/date-picker',
    icon: 'fa fa-calendar',
    title: 'Date picker',
    template: require('./date-picker.html')
})
export class DatePickerViewModel {
    public date = ko.observable(new Date());
}