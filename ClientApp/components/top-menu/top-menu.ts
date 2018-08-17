import * as _ from 'lodash';
import * as ko from 'knockout';

import { component } from "../../decorator/component";
import { IRoute, Router, Routes } from "../../common/router";

@component({
    name: 'top-menu',
    styles: require('./top-menu.css'),
    template: require('./top-menu.html')
})
export class TopMenuViewModel {
    router: Router;
    routes: IRoute[] = Routes;
    
    constructor(params: any) {

        this.router = params.router;
    }
}