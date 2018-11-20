import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import * as template from '@app/templates';

@handler({
    bindingName: 'months',
    resources: {
        en: {
            'january': 'Jan',
            'february': 'Feb',
            'march': 'Mar',
            'april': 'Apr',
            'may': 'May',
            'june': 'Jun',
            'july': 'Jul',
            'august': 'Aug',
            'september': 'Sep',
            'october': 'Oct',
            'november': 'Nov',
            'december': 'Dec'
        },
        vi: {
            'january': 'Tháng 1',
            'february': 'Tháng 2',
            'march': 'Tháng 3',
            'april': 'Tháng 4',
            'may': 'Tháng 5',
            'june': 'Tháng 6',
            'july': 'Tháng 7',
            'august': 'Tháng 8',
            'september': 'Tháng 9',
            'october': 'Tháng 10',
            'november': 'Tháng 11',
            'december': 'Tháng 12'
        }
    }
})
export class MonthsInYearBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => KnockoutObservable<number>, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let obser = valueAccessor();

        ko.utils.dom.setAttr(element, 'data-view', 'months');

        ko.utils.arrayForEach(ko.utils.date.monthNames, (item: string, index: number) => {
            if (index < 12) {
                element.appendChild(ko.utils.dom.create('li', {
                    'data-view': 'month',
                    'data-bind': `i18n: '${item}', css: $classCss(${index}), click: $month.bind($data, ${index})`
                }));
            }
        });

        ko.applyBindingsToDescendants({
            $month: (month: number) => {
                if (obser() !== month) {
                    obser(month);
                } else {
                    obser.valueHasMutated!();
                }
            },
            $classCss: (month: number) => ko.toJS(obser) == month ? 'picked' : ''
        }, element);

        return { controlsDescendantBindings: true };
    }
}

@handler({
    bindingName: 'weeks',
    resources: {
        en: {
            'sunday': 'Sun',
            'monday': 'Mon',
            'tuesday': 'Tue',
            'wednesday': 'Wed',
            'thursday': 'Thu',
            'friday': 'Fri',
            'saturday': 'Sat'
        },
        vi: {
            'sunday': 'CN',
            'monday': 'Th2',
            'tuesday': 'Th3',
            'wednesday': 'Th4',
            'thursday': 'Th5',
            'friday': 'Th6',
            'saturday': 'Th7'
        }
    }
})
export class DaysInWeekBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.utils.dom.setAttr(element, 'data-view', 'weeks');

        ko.utils.arrayForEach(ko.utils.date.dayNames, (item: string, index: number) => {
            if (index < 7) {
                let date = ko.utils.dom.create('li', { 'data-view': 'day', 'data-bind': `i18n: '${item}'` });
                element.appendChild(date);
            }
        });

        ko.applyBindingsToDescendants({}, element);

        return { controlsDescendantBindings: true };
    }
}


@handler({
    bindingName: 'day'
})
export class DaysInMonthBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.utils.dom.setAttr(element, 'data-view', 'days');

        ko.utils.arrayForEach(ko.utils.date.calendar(11, 2018), (_date: Date, index: number) => {
            let item = ko.utils.dom.create('li', {
                'data-view': 'day',
                'html': _date.getDate()
            });

            console.log(ko.utils.date.format(_date, "default"));

            if (_date.getMonth() != 10) {
                ko.utils.dom.addClass(item, 'out');
            }

            element.appendChild(item);
        });

        ko.applyBindingsToDescendants({}, element);

        return { controlsDescendantBindings: true };
    }
}

@handler({
    bindingName: 'date'
})
export class DateEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let mode = MODE.DAYS,
            control: ValidationObservable<any> = valueAccessor();

        ko.utils.setHtml(element, template.input);
        ko.utils.dom.addClass(element, 'form-group row');

        control
            .extend({
                $raw: ko.toJS(control),
                $value: ko.toJS(control)
            })
            .extend({
                $icons: {
                    after: 'fa fa-calendar'
                },
                $width: 150,
                $name: 'Datepicker',
                $columns: ['col-md-2', 'col-md-6']
            })
            .extend({
                $type: {
                    mask: Date,
                    min: new Date(1900, 0, 1),
                    max: new Date(9999, 11, 31),
                    lazy: true
                }
            });

        ko.applyBindingsToDescendants({
            $vm: {
                control: control
            }
        }, element);

        return { controlsDescendantBindings: true };
    }
}

enum MODE {
    YEARS = <any>'year',
    MONTHS = <any>'month',
    DAYS = <any>'day',
}