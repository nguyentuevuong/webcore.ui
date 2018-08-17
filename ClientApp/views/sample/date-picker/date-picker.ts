import * as ko from 'knockout';

import {component} from '../../../decorator/component';

@component({
    url: 'sample/date-picker',
    icon: 'fa fa-calendar',
    title: 'Date picker',
    template: require('./date-picker.html')
})
class DatePickerViewModel {
    public date = ko.observable(new Date());
}