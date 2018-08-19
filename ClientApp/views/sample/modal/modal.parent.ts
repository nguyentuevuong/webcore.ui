import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '../../../decorator/component';

@component({
    url: 'sample/modal',
    name: 'modal-sample',
    icon: 'fa fa-window-maximize',
    title: '#modal',
    template: require('./modal.parent.html'),
    resources: require('./resources.json')
})
export class SampleModalParentViewModel {

}