import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '../../../common';

@component({
    url: 'sample/modal',
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