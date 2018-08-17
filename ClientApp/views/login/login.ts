import * as ko from 'knockout';

import {component} from '../../decorator/component';

@component({
    url: '/login',
    icon: 'fa key',
    title: '#login',
    styles: require('./login.css'),
    template: require('./login.html')
})
export class LoginViewModel {
}