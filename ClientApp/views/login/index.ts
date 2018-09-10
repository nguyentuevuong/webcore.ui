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
                $focus: true,
                $attr: {
                    tabindex: 100,
                    ariaPlaceholder: 'I love you so much',
                }
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
        self.model.userName.subscribe((v: any) => console.log(new Date().getTime()));
    }

    checkValidate() {
        let self = this;
        self.model.userName.extend({
            $attr: {
                disabled: true,
                tabindex: 101,
                ariaPlaceholder: 'I love you so much',
            }
        });
        self.model.userName.checkError();
    }

    removeValidate() {
        let self = this;
        self.model.userName.extend({ $disable: true });
        self.model.userName.extend({ required: false });
    }

    afterRender(): void {
        let self = this;
    }

    dispose(): void {
    }
}