import { ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/navigate/modal',
    name: 'modal-sample',
    icon: 'fa fa-window-maximize',
    title: '#modal',
    template: require('./modal.parent.html'),
    resources: require('./resources.json')
})
export class SampleModalParentViewModel {

    userName: KnockoutObservable<string> = ko.observable('admin8');
    passWord: KnockoutObservable<string> = ko.observable('admin8');

}