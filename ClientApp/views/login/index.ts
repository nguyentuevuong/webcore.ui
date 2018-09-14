import * as ko from 'knockout';

import { route } from '@app/common/router';
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
                $focus: true,
                $multiline: false,
                $name: '#username',
                $constraint: '#noconstraint',
                $icons: {
                    before: 'fa fa-calendar'
                },
                //$width: 200,
                $columns: [
                    'col-md-4', 'col-md-12'
                ]
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
            $focus: false,
            $name: '#password',
            $attr: {
                type: 'password'
            },
            $icons: {
                before: 'far fa-address-card'
            }
        }).extend({
            required: true
        })
    }

    constructor(params: any, private element: HTMLElement) {
        let self = this;
        self.model.userName.subscribe((v: any) => console.log(new Date().getTime()));

        self.element.addEventListener("dialog.opening", (evt: Event) => {
            let data = (<CustomEvent>evt).detail;
            console.log(data);
        });

        // dispatch opening event
        self.element.dispatchEvent(new CustomEvent('dialog.opening', {
            detail: {
                id: 1,
                name: 'xxx'
            }
        }));
    }

    checkValidate() {
        let self = this;
        route.goto('/', { id: 100, name: 'goto' });
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