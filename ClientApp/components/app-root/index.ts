import * as ko from 'knockout';
import * as _ from 'lodash';
import { History } from 'history';

import { Router } from '@app/common/router';
import { component, IComponent, Components, IView, IDispose } from '@app/common/ko';

@component({
    name: 'app-root',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class AppRootViewModel implements IView, IDispose {
    public router: Router;
    public TEMPL = TEMPLATE;

    public template: KnockoutObservable<TEMPLATE | number> = ko.observable(TEMPLATE.HOME);

    constructor(params: { history: History, baseName: string }) {
        // Activate the client-side router
        this.router = new Router(params.history, Components, params.baseName);

        ko.computed({
            read: () => {
                let route: IComponent = ko.toJS(this.router),
                    templ = _(this.TEMPL).map(m => m)
                        .filter(f => !_.isNumber(f))
                        .map(m => String(m).toLowerCase())
                        .value(),
                    regx: Array<any> | null = route.history!.location.pathname.match(/[a-z]+/);

                if (_.isNil(regx)) {
                    this.template(this.TEMPL.HOME);
                } else {
                    this.template(_.indexOf(templ, regx[0]));
                }
            }
        });
    }

    public paserComp = (viewName: string) => {
        let viewNames = _.map(Components, v => v.name);
        
        return viewNames.indexOf(viewName) > -1 ? viewName : "no-component";
    }

    afterRender = () => {

    };

    // To support hot module replacement, this method unregisters the router and KO components.
    // In production scenarios where hot module replacement is disabled, this would not be invoked.
    public dispose() {
        this.router.dispose();

        _([]).each((comp: any) => ko.components.unregister(comp.name));
    }
}

enum TEMPLATE {
    OTHER = -1,
    HOME = 0,
    SAMPLE = 1
}