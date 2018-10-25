import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';


@component({
    url: 'sample/selection/table',
    name: 'sample-table',
    title: '#table',
    icon: 'fa fa-refresh',
    styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'width': 'Width',
            'display_row': 'Display rows',
            'fixed_column': 'Fixed columns #{default_0}',
            'default_0': '(default: 0)',
            'default_10': '(default: 10)',
            'negative_is_auto': 'Negative is allow lower #{default_10}',
            'zero_is_auto': 'Zero is auto #{default_0}'
        }, 'vi': {
            'width': 'Độ rộng',
            'display_row': 'Số dòng hiển thị',
            'fixed_column': 'Số cột cố định #{default_0}',
            'default_0': '(mặc định: 0)',
            'default_10': '(mặc định: 10)',
            'negative_is_auto': 'Giá trị âm thì chấp nhận nhỏ hơn #{default_10}',
            'zero_is_auto': 'Giá trị 0 thì tự động #{default_0}'
        }
    }
})
export class SampleFixedTableViewModel {
    dataSource: KnockoutObservableArray<{
        id: number;
        value1: KnockoutObservable<number>;
        value2: KnockoutObservable<number>;
        value3: KnockoutObservable<number>;
        value4: KnockoutObservable<number>;
        value5: KnockoutObservable<number>
    }> = ko.observableArrayOrig([]).extend({ deferred: true });

    width: KnockoutObservableSelection = ko.observableSelection(0).extend({ $name: '#width', $constraint: '#zero_is_auto', dataSources: [0, 600, 700, 800] });
    displayRow: KnockoutObservableSelection = ko.observableSelection(10).extend({ $name: '#display_row', $constraint: '#negative_is_auto', dataSources: [-10, -5, 5, 10, 15] });
    fixedColumn: KnockoutObservableSelection = ko.observableSelection(0).extend({ $name: '#fixed_column', dataSources: [0, 1, 2, 3] });
    columns: KnockoutObservableSelection = ko.observableSelection([50, 170, 100, 200, 100, 130, 200]).extend({
        $name: '#columns', dataSources: [
            {
                text: '[50, 100, 100, 100, 100, 100, 100]',
                value: [50, 100, 100, 100, 100, 100, 100]
            },
            {
                text: '[75, 200, 200, 200, 200, 200, 200]',
                value: [75, 200, 200, 200, 200, 200, 200]
            },
            {
                text: '[100, 100, 100, 100, 100, 100, 100]',
                value: [100, 100, 100, 100, 100, 100, 100]
            },
            {
                text: '[75, 150, 150, 120, 150, 150, 200]',
                value: [75, 150, 150, 120, 150, 150, 200]
            },
            {
                text: '[50, 170, 150, 100, 170, 200, 150]',
                value: [50, 170, 150, 100, 170, 200, 150]
            }
        ]
    });

    class: KnockoutObservable<string> = ko.observableOrig('table table-bordered');

    constructor(params: any, private element: HTMLElement) {
        ko.utils.extend(window, { $vm: this });

        let ds = [];

        for (var i = 1; i <= 25; i++) {
            ds.push({
                id: i,
                value1: ko.observableOrig(i),
                value2: ko.observableOrig(i + 1),
                value3: ko.observableOrig(i + 2),
                value4: ko.observableOrig(i + 3),
                value5: ko.observableOrig(i + 4),
            })
        }

        this.dataSource(ds);
    }

    addData() {
        let self = this,
            i = _.size(ko.toJS(self.dataSource)) + 1;

        self.dataSource.push({
            id: i,
            value1: ko.observableOrig(i),
            value2: ko.observableOrig(i),
            value3: ko.observableOrig(i),
            value4: ko.observableOrig(i),
            value5: ko.observableOrig(i),
        });
    }
}