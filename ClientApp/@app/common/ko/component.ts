import { ko } from '@app/providers';
import { i18n } from '@app/common/lang';
import { random } from '@app/common/utils';
import { Components } from '@app/common/ko';
import { MD5 } from '@app/common/utils';

interface IDecoratorComponent {
    url?: string;
    title?: string;
    icon?: string;
    name?: string;
    styles?: string;
    template?: string;
    resources?: {
        [lang: string]: {
            [key: string]: string
        }
    };
    options?: object;
}

interface ComponentConstructor {
    new(
        params: any,
        element: HTMLElement,
        templateNodes?: Node[]
    ): any;
}

interface ElementRef {
    element: HTMLElement,
    templateNodes: HTMLElement[]
}

/**
 * Register Knockout component by decorating ViewModel class
 **/
export function component(params: IDecoratorComponent) {
    return function (constructor: ComponentConstructor) {
        let id = random.id;

        // merge resources
        ko.utils.merge(i18n, params.resources);

        if (!params.name) {
            if (params.url) {
                params.name = MD5.init(params.url
                    .replace(/\/+/gi, '-')
                    .replace(/^-/gi, '')) || id;
            } else {
                params.name = id;
            }
        }

        // add all component to component
        Components.push({
            url: params.url && `/${params.url}`.replace(/\/+/gi, "/"),
            name: params.name,
            icon: params.icon || 'd-none',
            title: params.title || params.name
        });

        if (!ko.utils.isEmpty(params.styles)) {
            let rid = `[role="${id}"]`;

            params.styles = params.styles!
                .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '')
                // now all comments, newlines and tabs have been removed
                .replace(/\s{2,}/g, ' ')
                // now there are no more than single adjacent spaces left
                // now unnecessary: replace( /(\s)+\./g, ' .' );
                .replace(/\s([{:}])\s/g, '$1')
                // remove space after ; or ,
                .replace(/([;,])\s/g, '$1')
                // remove space before important char
                .replace(/\s!/g, '!')
                // add rid to selector
                .replace(/((([a-z]|.[a-z])|(}[a-z]|}.[a-z]))(-|_|[a-z]|[0-9])*,)/gi, `$1${rid} `)
                .replace(/}(?!$)/gi, `}${rid} `)
                // add rid to first selector of @media group
                .replace(/\{([a-z]|.[a-z]|[a-z]\.[a-z])*(-|_|[a-z]|[0-9])*\{/gi, (st: string) => `{${rid} ${st.replace(/{/g, '')}{`)
                // remove rid from last }
                .replace(/\[role="([a-z0-9])+"\]\s}/gi, '}')
                // replace rid from before @media by newline char*
                .replace(/\[role="([a-z0-9])+"\]\s@media/gi, '\r@media')
                // add newline (and) or tab to group 
                .replace(/.+/gi, (st: string) => {
                    // add new line before rid
                    return st.replace(/(\[role=")/gi, '\r$1')
                        .replace(/(,\r\[role=")/gi, ',[role="')
                        .replace(/(\r\[role=")/gi, (rt: string) => `\r${st.indexOf('@media') == 0 ? '\t' : ''}${rt.trim()}`)
                        .replace(/}}/gi, '}\r}');
                })
                .replace(/:\s/gi, ':')
                .replace(/;}/gi, '}');

            params.styles = `<style type='text/css'>${rid} ${params.styles}</style>`;
        }

        let viewName = params.name;
        ko.components.register(params.name || id, ko.utils.extend({
            viewModel: {
                createViewModel: (params: any, elementRef: ElementRef) => {
                    let element = elementRef.element,
                        templateNodes: Array<HTMLElement> = [].slice.call(elementRef.templateNodes)
                            .filter((node: HTMLElement) => !!node.tagName);
                    //$element = $(element),
                    //$contents = $element.find('content');

                    element.setAttribute('role', id);

                    /*if (_.size($contents) > 1) {
                        _.each($contents, elm => {
                            let $placeholder = $(elm),
                                query = $placeholder.attr('id'),
                                $content: HTMLElement | undefined = _.find(templateNodes, (tmp: HTMLElement) => tmp.getAttribute('id') == query);

                            if (!$content) {
                                $placeholder.remove();
                            } else {
                                $placeholder.replaceWith($content.innerHTML);
                            }
                        });
                    } else if (_.size($contents) == 1) {
                        $contents.replaceWith(templateNodes);
                    }*/

                    return new constructor(ko.utils.omit(params, ['$raw', 'component']), element, templateNodes);
                }
            },
            template: `${params.styles || ''}<!-- ko template: { afterRender: ($vm.afterRender || function() {}).bind($vm) } -->${params.template || `<span data-bind="i18n: 'view_name'"></span>:&nbsp<span data-bind="i18n: '${viewName}'"></span>`}<!-- /ko -->`,
            synchronous: true,
        }, params.options as Object));
    };
}