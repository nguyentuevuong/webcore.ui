import * as ko from 'knockout';
import * as _ from 'lodash';

import { component } from '../../decorator/component';

@component({
    url: '',
    icon: 'fa fa-home',
    title: '#home',
    template: require('./home.html')
})
export class HomeViewModel { }