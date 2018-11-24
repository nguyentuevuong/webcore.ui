import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/input/number',
    icon: 'fa fa-cogs',
    title: 'Number input',
    template: require('./index.html'),
})
export class SampleInputNumberViewModel {

}