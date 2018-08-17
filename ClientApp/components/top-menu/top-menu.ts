import * as _ from 'lodash';
import * as ko from 'knockout';

import { lang, i18n } from '../../common/app-i18n';
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

    lang: KnockoutObservable<string> = lang;
    regions: KnockoutObservableArray<string> = ko.observableArray([]);

    constructor(params: any) {
        this.regions(_.keys(i18n));

        this.router = params.router;
    }
}