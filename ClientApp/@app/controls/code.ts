import { ko } from '@app/providers';
import { handler } from '@app/common/ko';

const beautify = {
    js: require('js-beautify').js,
    css: require('js-beautify').css,
    html: require('js-beautify').html,
    configs: {
        "indent_size": "4",
        "indent_char": " ",
        "max_preserve_newlines": "5",
        "preserve_newlines": true,
        "keep_array_indentation": false,
        "break_chained_methods": false,
        "indent_scripts": "normal",
        "brace_style": "collapse",
        "space_in_paren": false,
        "space_in_empty_paren": false,
        "space_before_conditional": true,
        "unescape_strings": false,
        "jslint_happy": false,
        "end_with_newline": false,
        "wrap_line_length": "0",
        "indent_inner_html": true,
        "comma_first": false,
        "e4x": false
    }
};

import {
    Options,
    Highlighter,

    // import basic APIs
    registerLanguages,
    htmlRender,
    init,
    process,
    Result,
    // import preferred languages
    TypeScript,
    JavaScript,
    XML,
    CSS,
    SCSS,
    JSON
} from 'highlight-ts';

registerLanguages(XML, JavaScript, TypeScript, SCSS, CSS, JSON);

@handler({
    virtual: false,
    bindingName: 'code'
})
export class I18nBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        element.classList.add('pretty-print');
        ko.bindingHandlers.html.init!(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    }
    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let lang: Result<string> = {
            language: '',
            relevance: 0,
            value: ''
        },
            code: string | object = ko.unwrap(valueAccessor()),
            type: string = ko.toJS(ko.unwrap(allBindingsAccessor().type) || ''),
            options: Options = { useBr: true, classPrefix: '' },
            highlighter: Highlighter<string> = init(htmlRender, options);

        if (typeof code === 'string') {
            if (String(code).indexOf('#') == 0) {
                type = "xml";
                code = beautify.html(document.getElementById(String(code).replace(/#/, ''))!.outerHTML, beautify.configs);
            } else {
                lang = process(highlighter, String(code));
                switch (type || lang.language) {
                    case 'css':
                        type = "css";
                        code = beautify.css(code, beautify.configs);
                        break;
                    case 'scss':
                        type = "scss";
                        code = beautify.css(code, beautify.configs);
                        break;
                    case 'xml':
                        type = "xml";
                        code = beautify.html(code, beautify.configs);
                        break;
                    case 'typescript':
                        type = "typescript";
                        code = beautify.js(code, beautify.configs).replace(/\s<\s[a-z0-9_\-$]+\s>/gi, (match: string) => match.replace(/\s+/g, ''));
                        break;
                    case 'javascript':
                        type = "javascript";
                        code = beautify.js(code, beautify.configs).replace(/\s<\s[a-z0-9_\-$]+\s>/gi, (match: string) => match.replace(/\s+/g, ''));
                        break;
                }
            }
        } else {
            type = "json";
            code = beautify.js(ko.toJSON(code), beautify.configs);
        }

        lang = process(highlighter, String(code), type);

        ko.bindingHandlers.html.update!(element, () => `<code class='${type}'>${lang.value}</code>`, allBindingsAccessor, viewModel, bindingContext);
    }
}