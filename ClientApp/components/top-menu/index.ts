import * as _ from 'lodash';
import * as ko from 'knockout';

import { component } from "@app/common/ko";
import { Router } from '@app/common/router';

import { IComponent, Components } from '@app/common/ko';

@component({
    name: 'top-menu',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class TopMenuViewModel {
    router: Router;
    routes: IComponent[] = Components;

    constructor(params: { router: Router }) {
        this.router = params.router;
    }
}