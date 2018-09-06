const prettyJs = require('pretty-js');
import { _, ko } from '@app/providers';

export function formatJs(js: string | object) {
    if (typeof js == 'object') {
        js = ko.toJSON(js, undefined, 4);
    }

    return prettyJs(js, {
        indent: "    ",
        newline: "\r\n"
    });
}

export function formatXml(xml: string) {
    let pad = 0,
        formatted = '',
        reg = /(>)(<)(\/*)/g;

    xml = xml
        .replace(/[\r\n\t]|\s{2,}?/g, '')
        .replace(reg, '$1\r\n$2$3');

    _.each(xml.split('\r\n'), (node: string) => {
        let indent = 0,
            padding = '';

        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        for (var i = 0; i < pad; i++) {
            padding += '    ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
};