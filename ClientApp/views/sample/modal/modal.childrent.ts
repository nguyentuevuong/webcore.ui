import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '@app/common/ko';

@component({
    name: 'modal-child',
    icon: 'fa fa-window-maximize',
    title: '#login',
    template: require('./modal.childrent.html')
})
export class SampleModalChildrentViewModel {
    focus: KnockoutObservable<boolean> = ko.observable(false);
    userName: KnockoutObservable<string> = ko.observable('');
    passWord: KnockoutObservable<string> = ko.observable('');

    constructor(private params: { userName: KnockoutObservable<string>, passWord: KnockoutObservable<string> }) {
        if (params) {
            this.userName(ko.toJS(params.userName));
            this.passWord(ko.toJS(params.passWord));
        }
    }

    afterRender = () => {
        let self = this;

        self.focus(true)
    }

    getData() {
        this.params.userName(ko.toJS(this.userName));
        this.params.passWord(ko.toJS(this.passWord));
    }
}