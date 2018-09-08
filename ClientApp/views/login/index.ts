import * as ko from 'knockout';

import { component, IDispose, IView } from '@app/common/ko';

@component({
    url: '/access/signin',
    icon: 'fa fa-key',
    title: '#login',
    styles: require('./style.scss'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class LoginViewModel implements IView, IDispose {
    model: any = {
        userName: ko.observable('').extend({ required: '' }),
        passWord: ko.observable('').extend({ required: '' })
    }

    focus: any = {
        userName: ko.observable(true),
        passWord: ko.observable(false)
    }

    constructor(params: any, private element: HTMLElement) {
        let self = this;
        self.model.userName.clearError();
    }

    afterRender(): void {
    }

    dispose(): void {
    }
}