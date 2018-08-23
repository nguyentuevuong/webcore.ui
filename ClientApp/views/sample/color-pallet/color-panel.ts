import { component } from '../../../decorator/component';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

@component({
    url: 'sample/color',
    name: 'color-panel',
    title: 'Color system',
    icon: 'fa fa-users',
    template: require('./color-panel.html')
})
export class SampleColorViewModel {
}