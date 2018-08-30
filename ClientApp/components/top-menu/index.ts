import * as _ from 'lodash';
import * as ko from 'knockout';

import { component, IRoute, Router, Routes } from "common";

@component({
    name: 'top-menu',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class TopMenuViewModel {
    router: Router;
    routes: IRoute[] = Routes;

    constructor(params: any) {

        this.router = params.router;
    }
}