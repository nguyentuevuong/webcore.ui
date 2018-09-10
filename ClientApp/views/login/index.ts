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
        userName: ko.observable('')
            .extend({
                $name: '#username',
                $focus: false
            }).extend({
                required: true,
                validate: (v: any) => {
                    if (v == 'admin') {
                        return 'Ten dang nhap da ton tai';
                    }

                    return undefined;
                }
            }),
        passWord: ko.observable('').extend({
            $focus: false
        })
    }

    constructor(params: any, private element: HTMLElement) {
        let self = this;
        self.model.userName.$focus(true);
        self.model.userName.subscribe((v: any) => console.log(new Date().getTime()));
    }

    addValidate() {
        let self = this;
        self.model.userName.extend({
            required: true
        });
    }

    removeValidate() {
        let self = this;
        self.model.passWord.$focus(true);
        //self.model.userName.extend({ required: false });
    }

    afterRender(): void {
        let self = this;
        self.model.userName.clearError();
    }

    dispose(): void {
    }
}