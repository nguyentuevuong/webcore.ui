import * as ko from 'knockout';

import { component } from '../../common';

@component({
    url: '/access/signin',
    icon: 'fa fa-key',
    title: '#login',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class LoginViewModel {
    focus: any = {
        userName: ko.observable(true),
        passWord: ko.observable(false)
    }

    constructor(params: any, private element: HTMLElement) {
        console.log(element.outerHTML);
    }

    afterRender = () => {
        let self = this;

        console.log(self.element.outerHTML);
    }
}