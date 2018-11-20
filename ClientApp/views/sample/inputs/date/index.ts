import { ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/input/date',
    icon: 'fa fa-cogs',
    title: 'Date input',
    template: require('./index.html'),
})
export class SampleInputDateViewModel {
    date: KnockoutObservableDate = ko.observableDate(new Date());
    month: KnockoutObservable<number> = ko.observableOrig(2);
    daysMatrix: KnockoutObservableArray<Date> = ko.observableArrayOrig(ko.utils.date.calendar(11, 2018));
}