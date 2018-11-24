import { component } from '@app/common/ko';

@component({
    url: 'sample/utils/dom',
    name: 'utils-dom',
    title: 'utils_dom',
    icon: 'fa fa-code',
    //styles: require('./style.scss'),
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|utils': 'Utils',
            'color_system': 'Color system'
        },
        'vi': {
            'sample|utils': 'Tiện ích & công cụ khác',
            'color_system': 'Màu sắc hệ thống'
        }
    }
})
export class DOMUtilsViewModel {
}