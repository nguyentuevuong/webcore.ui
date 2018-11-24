import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/input/clock',
    icon: 'fa fa-cogs',
    title: 'Clock input',
    template: require('./index.html'),
    resources: {
        'en': {
            'sample|input': 'Input controls'
        },
        'vi': {
            'sample|input': 'Điều khiển dạng nhập'
        }
    }
})
export class SampleInputClockViewModel {

}