import { component } from '@app/common/ko';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

@component({
    url: 'sample/color',
    name: 'color-panel',
    title: 'Color system',
    icon: 'fa fa-users',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class SampleColorViewModel {
}