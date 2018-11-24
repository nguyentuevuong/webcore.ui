import { _, ko } from '@app/providers';
import { Router } from '@app/common/router';
import { component, IComponent, Components, IView, IDispose } from '@app/common/ko';

@component({
    name: 'app-root',
    styles: require('./style.scss'),
    template: require('./index.html')
})
export class AppRootViewModel implements IView, IDispose {
    public router: Router | undefined;
    public TEMPL = TEMPLATE;

    public template: KnockoutObservable<TEMPLATE | number> = ko.observable(TEMPLATE.HOME);

    constructor(params: { baseName: string }) {
        let self = this;
        // Activate the client-side router
        self.router = new Router(params.baseName);
        
        ko.computed({
            read: () => {
                let route: IComponent = ko.toJS(self.router),
                    templ = _(self.TEMPL).map(m => m)
                        .filter(f => !_.isNumber(f))
                        .map(m => String(m).toLowerCase())
                        .value(),
                    regx: Array<any> | null = location.pathname.match(/[a-z]+/);

                if (_.isNil(regx)) {
                    self.template(self.TEMPL.HOME);
                } else {
                    self.template(_.indexOf(templ, regx[0]));
                }
            }
        });
    }

    // find registered components
    public paserComp = (viewName: string) => _.map(Components, v => v.url && v.name).indexOf(viewName) > -1 ? viewName : "no-component";

    // prevent error for first load
    afterRender = () => { };

    // To support hot module replacement, this method unregisters the router and KO components.
    // In production scenarios where hot module replacement is disabled, this would not be invoked.
    public dispose() {
        let self = this;

        if (self.router) {
            self.router.dispose();
        }

        _(Components).each((comp: IComponent) => ko.components.unregister(comp.name || ''));
    }
}

enum TEMPLATE {
    OTHER = -1,
    HOME = 0,
    SAMPLE = 1
}