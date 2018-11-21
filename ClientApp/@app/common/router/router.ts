import { _, ko } from '@app/providers';

import { History } from 'history';
import * as crossroads from 'crossroads';

import { IComponent, Components } from '@app/common/ko';
import { lang, i18n, getText } from '@app/common/lang';

// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.
export class Router {
    public currentRoute = ko.observableOrig<IComponent>({});
    private disposeHistory: () => void;
    private clickEventListener: (evt: MouseEvent) => void;

    constructor(private history: History, basename: string) {
        let self = this;

        // extend NormAsObject
        ko.utils.extend(crossroads, {
            normalizeFn: crossroads.NORM_AS_OBJECT
        });

        // Reset and configure Crossroads so it matches routes and updates this.currentRoute
        crossroads.removeAllRoutes();
        crossroads.resetState();

        crossroads.bypassed.add(url => {
            // not match any route
            self.currentRoute({
                url: url,
                title: 'Not found',
                name: 'no-component',
                history: history,
                component: {
                    name: 'no-component'
                }
            });

            // clear old errors
            ko.clearError();

            // remove lastest matched url
            ko.utils.extend(crossroads, {
                _prevMatchedRequest: null
            });
        })

        Components.forEach(route => {
            if (route.url) {
                crossroads.addRoute(route.url, (requestParams: any) => {
                    let rmk = _(requestParams)
                        .keys()
                        .map(k => Number(k))
                        .filter(k => _.isNumber(k))
                        .map(k => String(k))
                        .value();

                    // clear old errors
                    ko.clearError();

                    // remove request, vals, number params;
                    self.currentRoute(ko.utils.extend({ component: route }, _.omit(requestParams, _.concat(rmk, ['request_', 'vals_']))));

                    // remove lastest bypassed url
                    ko.utils.extend(crossroads, {
                        _prevBypassedRequest: null
                    });
                });
            }
        });

        // Make history.js watch for navigation and notify Crossroads
        this.disposeHistory = history.listen(location => {
            crossroads.parse(location.pathname, [location.state]);
        });

        this.clickEventListener = (evt: MouseEvent) => {
            let target: HTMLElement = evt.target as HTMLElement,
                clickPrevent = (anchor: HTMLAnchorElement) => {
                    let href = anchor.getAttribute('href');

                    if (href!.indexOf(`${basename}/`) === 0) {
                        history.push(href!.substring(basename.length));
                        evt.preventDefault();
                    } else if (href == "#") {
                        evt.preventDefault();
                    }
                };

            if (target) {
                if (target.tagName === 'A') {
                    clickPrevent(target as HTMLAnchorElement);
                } else {
                    target = target.closest('a') as HTMLElement;
                    if (target) {
                        clickPrevent(target as HTMLAnchorElement);
                    }
                }
            }
        };

        ko.utils.registerEventHandler(document, 'click', self.clickEventListener);

        // Initialize Crossroads with starting location
        crossroads.parse(history.location.pathname);

        // computed route for change title
        ko.computed({
            read: () => {
                let _lang: string = ko.toJS(lang),
                    route: IComponent = ko.toJS(self.currentRoute),
                    title: HTMLElement | null = document.querySelector('head>title');

                // change title of document
                if (title) {
                    title.innerText = !!ko.utils.get(route, 'component.title') ? getText(route.component.title) : (route.url || '');
                }
            }
        });
    }

    public link = (url: string): string => this.history.createHref({ pathname: url.replace(/([\/|\-|\_]:\w+:)+/g, '') });

    goto = (url: string, params: any) => {
        let self = this;

        self.history.push(url, params);
    }

    public dispose() {
        let self = this;

        self.disposeHistory();

        // remove 
        ko.utils.removeEventHandler(document, 'click', self.clickEventListener);
    }
}