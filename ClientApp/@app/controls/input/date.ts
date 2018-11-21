import { ko } from '@app/providers';
import { handler } from '@app/common/ko';
import * as template from '@app/templates';

@handler({
    bindingName: 'date',
    resources: {
        en: {
            'sunday': 'Sun',
            'monday': 'Mon',
            'tuesday': 'Tue',
            'wednesday': 'Wed',
            'thursday': 'Thu',
            'friday': 'Fri',
            'saturday': 'Sat',
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
            'sunday': 'CN',
            'monday': 'Th2',
            'tuesday': 'Th3',
            'wednesday': 'Th4',
            'thursday': 'Th5',
            'friday': 'Th6',
            'saturday': 'Th7',
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
export class DateEditorBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let mode = ko.observableOrig(MODE.DAYS),
            dom = ko.utils.dom,
            rng = ko.utils.range(0, 11),
            dow = ko.utils.date.dayNames,
            moy = ko.utils.date.monthNames,
            control: ValidationObservable<any> = valueAccessor(),

            $colLabel = dom.create('div', { 'class': 'col-md-12' }),
            $colInput = dom.create('div', { 'class': 'col-md-12' }),
            $ddCont = dom.create('div', { 'class': 'dropdown' }),

            $input = dom.create('input', { 'type': 'text', 'class': 'form-control', 'data-toggle': 'dropdown' }) as HTMLInputElement,
            $dropdown = dom.create('div', { 'data-view': 'datepicker', 'class': 'dropdown-menu noselect' }),

            $controls = dom.create('ul', { 'data-view': 'controls', 'data-dismiss': 'false' }),
            $prevCtrl = dom.create('li', { 'data-view': 'control prev', 'html': '‹' }),
            $currCtrl = dom.create('li', { 'data-view': 'control current', 'html': 'October 2018' }),
            $nextCtrl = dom.create('li', { 'data-view': 'control next', 'html': '›' }),
            $years = dom.create('ul', { 'data-view': 'years', 'data-dismiss': 'false' }),
            $months = dom.create('ul', { 'data-view': 'months', 'data-dismiss': 'false' }),
            $weeks = dom.create('ul', { 'data-view': 'weeks', 'data-dismiss': 'false' }),
            $days = dom.create('ul', { 'data-view': 'days' });

        element.appendChild($colLabel);
        element.appendChild($colInput);
        $colInput.appendChild($ddCont);

        $ddCont.appendChild($input);
        $ddCont.appendChild($dropdown);

        $dropdown.appendChild($controls);

        $controls.appendChild($prevCtrl);
        $controls.appendChild($currCtrl);
        $controls.appendChild($nextCtrl);

        $dropdown.appendChild($years);
        $dropdown.appendChild($months);
        $dropdown.appendChild($weeks);
        $dropdown.appendChild($days);

        rng.forEach((index: number) => {
            $years.appendChild(dom.create('li', { 'data-view': 'year', 'data-bind': `i18n: '${index}'` }));
            $months.appendChild(dom.create('li', { 'data-view': 'month', 'data-bind': `i18n: '${moy[index + 12].toLowerCase()}'` }));
        });

        ko.utils.range(0, 6).forEach((index: number) => {
            $weeks.appendChild(dom.create('li', { 'data-view': 'day', 'data-bind': `i18n: '${dow[index + 7].toLowerCase()}'` }))
        });

        ko.utils.date.calendar(11, 2018)
            .forEach((day: Date, index: number) => {
                let domDay = dom.create('li', { 'data-view': 'day', 'data-bind': `i18n: '${day.getDate()}'` });
                $days.appendChild(domDay);

                ko.utils.registerEventHandler(domDay, 'click', (evt: MouseEvent) => {
                    $input.value = ko.utils.date.format(day, 'dd/mm/yyyy');
                });
            });

        dom.addClass(element, 'form-group row');

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

        ko.computed({
            read: () => {
                let _mode = ko.toJS(mode);

                [].slice.call($dropdown.childNodes)
                    .forEach((child: HTMLElement) => {
                        if (child != $controls) {
                            $dropdown.removeChild(child);
                        }
                    });

                switch (_mode) {
                    case MODE.DAYS:
                        $dropdown.appendChild($weeks);
                        $dropdown.appendChild($days);
                        break;
                    case MODE.MONTHS:
                        $dropdown.appendChild($months);
                        break;
                    case MODE.YEARS:
                        $dropdown.appendChild($years);
                        break;
                }
            }
        })

        return { controlsDescendantBindings: true };
    }
}

enum MODE {
    YEARS = <any>'year',
    MONTHS = <any>'month',
    DAYS = <any>'day',
}