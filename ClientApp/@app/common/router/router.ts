import { _, ko } from '@app/providers';
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
    private clickEventListener: (evt: MouseEvent) => void;

    constructor(basename: string) {
        let self = this;

        // Make history watch for navigation and notify currentRoute
        history.listener((data: any, url: string) => {
            let component = ko.utils.arrayFirst(Components, c => {
                if (c.url) {
                    let keys: Array<string> = [],
                        flags = url.match(new RegExp(`^${c.url.replace(/:[^\s/]+/g,
                            (match: string) => {
                                keys.push(match.replace(/:/g, ''));
                                return '([\\w-]+)';
                            })}$`));

                    if (flags) {
                        if (!c.params) {
                            c.params = {};
                        }

                        flags = flags.slice(1);

                        ko.utils.arrayForEach(keys, (key: string, index: number) => {
                            c.params[key] = flags && flags[index];
                        });

                        return true;
                    }

                    return false;
                }

                return false;
            });

            if (component) {
                self.currentRoute({
                    url: url,
                    params: data,
                    component: component
                })
            } else {
                self.currentRoute({
                    url: url,
                    title: 'Not found',
                    name: 'no-component',
                    component: {
                        name: 'no-component'
                    }
                });
            }
        });

        this.clickEventListener = (evt: MouseEvent) => {
            let target: HTMLElement = evt.target as HTMLElement,
                clickPrevent = (anchor: HTMLAnchorElement) => {
                    let href = anchor.getAttribute('href');

                    if (href!.indexOf(`${basename}/`) === 0) {
                        history.pushState(null, href!.substring(basename.length));
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

        // Initialize history with starting location
        history.replaceState(null, location.pathname);

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

    public link = (url: string): string => url.replace(/([\/|\-|\_]:\w+)+/g, '');

    public dispose() {
        let self = this;

        // remove 
        ko.utils.removeEventHandler(document, 'click', self.clickEventListener);
    }
}