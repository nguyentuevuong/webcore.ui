import { component } from '@app/common/ko';

@component({
    url: 'sample/uis/color',
    name: 'color-panel',
    title: 'color_system',
    icon: 'fa fa-users',
    styles: require('./style.scss'),
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
export class SampleColorViewModel {
}