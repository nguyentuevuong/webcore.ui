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
            'zero_is_auto': 'Zero is auto #{default_0}',
            'columns': 'Columns widths',
            'class_name': 'Class name (css)',
            'change_class_name': 'Change class name subscribe change view (row height)',
            'clear': 'Clear',
            'add_data': 'Add data'
        }, 'vi': {
            'width': 'Độ rộng',
            'display_row': 'Số dòng hiển thị',
            'fixed_column': 'Số cột cố định #{default_0}',
            'default_0': '(mặc định: 0)',
            'default_10': '(mặc định: 10)',
            'columns': 'Độ rộng cột',
            'negative_is_auto': 'Giá trị âm thì chấp nhận nhỏ hơn #{default_10}',
            'zero_is_auto': 'Giá trị 0 thì tự động #{default_0}',
            'class_name': 'Tên lớp css',
            'change_class_name': 'Thay đổi class để thấy sự thay đổi độ cao dòng',
            'clear': 'Xóa',
            'add_data': 'Thêm dữ liệu'
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
    displayRow: KnockoutObservableSelection = ko.observableSelection(-5).extend({ $name: '#display_row', $constraint: '#negative_is_auto', dataSources: [-10, -5, 5, 10, 15] });
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
                text: '[50, 170, 150, 100, 170, 200, -1]',
                value: [50, 170, 150, 100, 170, 200, -1]
            }
        ]
    });

    class: KnockoutObservableString = ko.observableString('table').extend({ $name: '#class_name', $constraint: '#change_class_name' });


    tmp = {
        html: html,
        vm: vm
    };

    constructor(params: any, private element: HTMLElement) {
        let self = this,
            ds = [];

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

        self.dataSource(ds);

        self.class.subscribe(v => {
            setTimeout(() => {
                self.width.valueHasMutated!();
            }, 0);
        });
    }

    addData() {
        let self = this,
            j = _.size(ko.toJS(self.dataSource)) + 1;

        self.dataSource.push({
            id: j,
            value1: ko.observableOrig(j),
            value2: ko.observableOrig(j),
            value3: ko.observableOrig(j),
            value4: ko.observableOrig(j),
            value5: ko.observableOrig(j)
        });
    }
}


let html = `<table id="fxtable" class="tbl-employees" data-bind="table: $vm.dataSource, configs: { width: $vm.width, displayRow: $vm.displayRow, fixedColumn: $vm.fixedColumn, columns: $vm.columns }">
<thead>
    <tr>
        <th colspan="2" data-bind="i18n: '#width'"></th>
        <th colspan="5">Cols 2</th>
    </tr>
    <tr>
        <th>Index</th>
        <th>Value 1</th>
        <th colspan="2">Value 2</th>
        <th>Value 3</th>
        <th>Value 4</th>
        <th>Value 5</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>
            <i class="fa fa-trash" data-bind="click: $vm.dataSource.remove.bind($vm.dataSource, $data)"></i>
        </td>
        <td><input type="text" data-bind="value: $data.value1" /></td>
        <td><input type="text" data-bind="value: $data.value2" /></td>
        <td><input type="text" data-bind="value: $data.value3" /></td>
        <td><input type="text" data-bind="value: $data.value4" /></td>
        <td><input type="text" data-bind="value: $data.value5" /></td>
        <td><input type="text" data-bind="value: $data.value5" /></td>
    </tr>
</tbody>
</table>`,
    vm = `class SampleFixedTableViewModel {
        dataSource: KnockoutObservableArray<{
            id: number;
            value1: KnockoutObservable<number>;
            value2: KnockoutObservable<number>;
            value3: KnockoutObservable<number>;
            value4: KnockoutObservable<number>;
            value5: KnockoutObservable<number>
        }> = ko.observableArrayOrig([]).extend({ deferred: true });
    
        width: KnockoutObservableSelection = ko.observableSelection(0).extend({ $name: '#width', $constraint: '#zero_is_auto', dataSources: [0, 600, 700, 800] });
        displayRow: KnockoutObservableSelection = ko.observableSelection(-5).extend({ $name: '#display_row', $constraint: '#negative_is_auto', dataSources: [-10, -5, 5, 10, 15] });
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
                    text: '[50, 170, 150, 100, 170, 200, -1]',
                    value: [50, 170, 150, 100, 170, 200, -1]
                }
            ]
        });
    }`;