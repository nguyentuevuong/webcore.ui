import * as ko from 'knockout';

import { component } from '@app/common/ko';

@component({
    url: 'sample/date-picker',
    icon: 'fa fa-calendar',
    title: 'Date picker',
    styles: require('./style.scss'),
    template: require('./date-picker.html')
})
export class DatePickerViewModel {
    month: KnockoutObservable<number> = ko.observableOrig(2);
    daysMatrix: KnockoutObservableArray<Date> = ko.observableArrayOrig(ko.utils.date.calendar(11, 2018));

    constructor() {
        let self = this;
        
        self.month.subscribe(v => console.log(v));
    }
}