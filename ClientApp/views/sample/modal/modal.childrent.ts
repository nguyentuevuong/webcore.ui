import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '../../../decorator/component';

@component({
    name: 'modal-child',
    icon: 'fa fa-window-maximize',
    title: '#login',
    template: require('./modal.childrent.html')
})
export class SampleModalChildrentViewModel {
    btnName: KnockoutObservable<string> = ko.observable('Show modal');

    constructor(private params: { btnName: string }) {
        if (params && params.btnName) {
            this.btnName(params.btnName);
        }
    }

}