import { component } from '@app/common/ko';

@component({
    url: 'sample/utils/date',
    name: 'utils-date',
    title: 'utils_date',
    icon: 'fa fa-calendar',
    //styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|uis': 'Icons & colors',
            'color_system': 'Color system'
        },
        'vi': {
            'sample|uis': 'Biểu tượng & màu sắc',
            'color_system': 'Màu sắc hệ thống'
        }
    }
})
export class DateUtilsViewModel {
}