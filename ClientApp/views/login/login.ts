import * as ko from 'knockout';

import {component} from '../../decorator/component';

@component({
    url: '/login',
    icon: 'fa fa-key',
    title: '#login',
    styles: require('./login.css'),
    template: require('./login.html')
})
export class LoginViewModel {
    focus: any = {
        userName: ko.observable(true),
        passWord: ko.observable(false)
    }
}