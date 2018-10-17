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
    dataSource: KnockoutObservableArray<number> = ko.observableArrayOrig([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).extend({ deferred: true });
    constructor(params: any, private element: HTMLElement) {
        ko.utils.extend(window, { $vm: this });
    }
}