import { ko } from '@app/providers';

import { handler } from '@app/common/ko';
import { formatJs, formatXml } from '@app/common/pretty';

import {
    Options,
    Highlighter,

    // import basic APIs
    registerLanguages,
    htmlRender,
    init,
    process,

    // import preferred languages
    TypeScript,
    XML
} from 'highlight-ts';

registerLanguages(XML, TypeScript);

@handler({
    virtual: false,
    bindingName: 'code'
})
export class I18nBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.bindingHandlers.html.init!(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let code: string | object = ko.unwrap(valueAccessor()),
            options: Options = { useBr: true, classPrefix: '' },
            highlighter: Highlighter<string> = init(htmlRender, options);

        if (typeof code === 'string') {
            if (String(code).indexOf('#') == 0) {
                code = document.getElementById(String(code).replace(/#/, ''))!.outerHTML;
            } else {
                code = formatJs(code);
            }
        } else {
            code = formatJs(code);
        }

        let formater = process(highlighter, String(code));

        ko.bindingHandlers.html.update!(element, () => `<code class='${formater.language}'>${formater.value}</code>`, allBindingsAccessor, viewModel, bindingContext);
    }
}