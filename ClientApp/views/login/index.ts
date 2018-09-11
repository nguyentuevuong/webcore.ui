import * as ko from 'knockout';

import { component, IDispose, IView } from '@app/common/ko';
import { route } from '@app/common/router';

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
                $focus: true
            }).extend({
                required: true,
                validate: (v: any) => {
                    if (v == 'admin') {
                        return 'Ten dang nhap da ton tai';
                    } else if (v == 'vuong') {
                        return 'Cai ten qua dep, khong danh cho ban';
                    }

                    return undefined;
                },
                regex: {
                    pattern: /[^0-9]+/g,
                    message: 'Gia tri nhap khong khop voi regex: \/[^0-9]+\/g'
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
        route.router!.goto('/', { id: 100, name: 'goto' });
        //self.model.userName.checkError();
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