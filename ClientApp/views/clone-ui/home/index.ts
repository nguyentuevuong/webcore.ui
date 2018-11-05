import { component } from '@app/common/ko';

@component({
    url: '/clone-ui/nittsu',
    icon: 'fa fa-home',
    title: '#nittsusystem',
    template: require('./index.html'),
    styles: require('./style.scss'),
    resources: {
        'en': {
            nittsusystem: '導入企業5000社以上の勤怠管理システム「日通システム株式会社」'
        },
        'vi': {
            nittsusystem: '導入企業5000社以上の勤怠管理システム「日通システム株式会社」'
        },
        'jp': {
            nittsusystem: '導入企業5000社以上の勤怠管理システム「日通システム株式会社」'
        }
    }
})
export class CloneNittsuUIViewModel {
}