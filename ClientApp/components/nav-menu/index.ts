import * as $ from 'jquery';
import * as _ from 'lodash';
import * as ko from 'knockout';

import { component } from '@app/common/ko';
import { Router } from '@app/common/router';
import { IComponent, Components } from '@app/common/ko';

interface NavMenuParams {
    router: Router;
    routes: IComponent[];
}

@component({
    name: 'nav-menu',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class NavMenuViewModel {
    public router: Router;
    public routes: IComponent[] = Components;

    public keyword: KnockoutObservable<string> = ko.observable('');

    constructor(params: NavMenuParams) {
        // This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
        // You could remove this viewmodel entirely, and define 'nav-menu' as a template-only component.
        // But in most apps, you'll want some viewmodel logic to determine what navigation options appear.
        this.router = params.router;
    }

    public filterRoute() {
        let self = this,
            routes: Array<IComponent> = ko.toJS(self.routes),
            keyword: string = _.toLower(ko.toJS(self.keyword));

        return _.filter(routes, r => {
            return _.toLower(r.title).indexOf(keyword) > -1 && (r.url || '').indexOf('sample') > -1;
        });
    }

    public toggleSample(model: any, evt: any) {
        $('.fa-ud-chevron')
            .toggleClass('fa-chevron-down')
            .toggleClass('fa-chevron-up');
        $('.nav-sample').toggleClass('d-none');
        evt.stopPropagation();
    }
}
