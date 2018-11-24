import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/input/time',
    icon: 'fa fa-cogs',
    title: 'Time input',
    template: require('./index.html'),
})
export class SampleInputTimeViewModel {

}