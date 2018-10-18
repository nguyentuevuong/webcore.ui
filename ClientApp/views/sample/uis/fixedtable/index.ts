import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';


@component({
    url: 'sample/selection/fixed-table',
    name: 'sample-table',
    title: '#fixed_table',
    icon: 'fa fa-refresh',
    styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|navigate': 'Navigate controls'
        }, 'vi': {
            'sample|navigate': 'Điểu khiển điều hướng'
        }
    }
})
export class SampleFixedTableViewModel {
    dataSource: KnockoutObservableArray<{
        id: number,
        value1: KnockoutObservable<string>,
        value2: KnockoutObservable<string>,
        value3: KnockoutObservable<string>,
        value4: KnockoutObservable<string>,
        value5: KnockoutObservable<string>
    }> = ko.observableArrayOrig([]).extend({ deferred: true });
    constructor(params: any, private element: HTMLElement) {
        ko.utils.extend(window, { $vm: this });

        for (var i = 1; i <= 50; i++) {
            this.dataSource.push({
                id: i,
                value1: ko.observableOrig(''),
                value2: ko.observableOrig(''),
                value3: ko.observableOrig(''),
                value4: ko.observableOrig(''),
                value5: ko.observableOrig(''),
            })
        }
    }
}