import { ko } from '@app/providers';

export { MarkDown as md };

/**
 * Markdown - A very basic regex-based Markdown parser
 *
 * - Headers
 * - Links
 * - Bold
 * - Emphasis
 * - Deletions
 * - Quotes
 * - Inline code
 * - Blockquotes
 * - Ordered/unordered lists
 * - Horizontal rules
 *
 * Author: Tue Vuong <nguyentuevuong@gmail.com>
 * Website: http://nhanvuong.vn
 * License: MIT
 */
export class MarkDown {
    private static Regexs: {
        [key: string]: RegExp
    } = {
            hr: /^(?:([-_=] ?)+)\1\1$/gm,
            headline: /^(\#{1,6})([^\n]+)$/gm,
            lists: /^((\s*(\+|-|\d\.)\s[^\n]+)\n)+/gm,
            bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
            code: /(\s|\n)*(`{3})\n?([^`]+)(`{3})(\s|\n)*/g, ///(\n)*`{3}[a-z]*\n[\s\S]*?\n`{3}/g
            reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
            links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
            mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
            tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
            url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g,
            url2: /[ \t\n]([a-zA-Z]{2,16}:\/\/[a-zA-Z0-9@:%_\+.~#?&=]{2,256}.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)[ \t\n]/g
        };

    static parse(str: string) {
        /* headlines */
        str = str.replace(MarkDown.Regexs.headline, match => {
            let string = match.replace(/^#{1,6}/, '').trim(),
                length = ko.utils.size((match.match(/^#{1,6}/) || [''])[0]),
                hrefId = (string.match(/#\{.*\}$/) || [''])[0].replace(/[#\{\}]/g, '').trim();

            return `<h${length} ${hrefId ? `id='${hrefId}'` : ''}>${string.replace(/(#\{.*\}|\n)$/, '').trim()}</h${length}>`;
        });

        /* List */
        str = str.replace(MarkDown.Regexs.lists, (match: string) => {
            let orul: Array<string> = [],
                hir: number = -1,
                hirs: Array<number> = [],
                rows: Array<string> = match
                    .split(/\n/g)
                    .filter(f => !!f.trim()),
                html: Array<string> = [];

            [].slice.call(rows).forEach((row: string) => {
                let text = row.trim(),
                    uro = text.indexOf('-') == 0 || text.indexOf('+') == 0,
                    indent = row.match(/^\s*/)![0].length;

                if (hir == -1) {
                    hirs.push(indent);
                    html.push(uro ? '<ul>' : '<ol>');
                    orul.push(uro ? '</ul>' : '</ol>');

                    html.push(`<li>${text.substring(text.indexOf(' ') + 1)}</li>`);
                } else if (hir != indent) {
                    if (hir > indent) {
                        while (hirs[hirs.length - 1] > indent) {
                            hirs.pop();
                            html.push(orul.pop() || '');
                        }
                    }

                    if (hir < indent) {
                        hirs.push(indent);
                        html.push(uro ? '<ul>' : '<ol>');
                        orul.push(uro ? '</ul>' : '</ol>');
                    }

                    html.push(`<li>${text.substring(text.indexOf(' ') + 1)}</li>`);
                } else {
                    html.push(`<li>${text.substring(text.indexOf(' ') + 1)}</li>`);
                }

                hir = indent;
            });

            while (orul.length > 0) {
                hirs.pop();
                html.push(orul.pop() || '');
            }

            return html.join('');
        });

        /* horizontal line */
        str = str.replace(MarkDown.Regexs.hr, () => `<hr />`);

        /* delete */
        str = str.replace(/(\~{2}?([^\*]+)\~{2})/g, match => `<del>${match.replace(/\~{2}/g, '')}</del>`);

        /* bold & italic */
        str = str.replace(/([\*_]{3}?([^(\*|_)]+)[\*_]{3})/g, match => `<b><i>${match.replace(/[\*_]{3}/g, '')}</i></b>`);

        /* bold */
        str = str.replace(/([\*_]{2}?([^(\*|_)]+)[\*_]{2})/g, match => `<b>${match.replace(/[\*_]{2}/g, '')}</b>`);

        /* italic */
        str = str.replace(/([\*_]{1}?([^(\*|_)]+)[\*_]{1})/g, match => `<i>${match.replace(/[\*_]{1}/g, '')}</i>`);

        /* checkbox */
        str = str.replace(/\[(\s|x)*\]/g, match => `<i class='fa fa-${match.match(/x/) ? 'check-circle-o' : 'circle-o'}'></i>`);

        /* code */
        str = str.replace(MarkDown.Regexs.code, match => {
            let lang = '',
                code = match
                    .replace(/`{3}([a-z0-9])*\n/, match => {
                        lang = match.replace(/(`|\n)/g, '');
                        return '';
                    })
                    .replace(/\n/g, '§§§')
                    .replace(/`/g, '')
                    .replace(/\s+/g, ' ').trim();
            return `<pre data-bind='code: "", type: "${lang}"'>${ko.utils.escape(code).replace(/§{3}/g, '<br />')}</pre>`;
        });

        /* inline code */
        str = str.replace(/\`{1}?([^`]+)\`{1}/g, match => `<code>${match.replace(/`/g, '')}</code>`);

        /* bock quotes */
        str = str.replace(/(^(\n*(&gt;|>)) ?.+?)(\r?\n\r?\n)/gms, match => {// /^( *(\&gt;|&amp;gt;|&amp;amp;gt|\>)[^\n]+(\n(?!def)[^\n]+)*)+/gm, match => {
            let quotes = [].slice.call(match.split('\n') || [])
                .filter((str: string) => !!str)
                .map((line: string) => line
                    .replace(/^( *(\&gt;|&amp;gt;|&amp;amp;gt|\>)\s*)/g, '')
                    .replace(/\n/g, '§§§').trim());

            return `<blockquote class="blockquote">${quotes.join('\n').replace(/§{3}/g, '<br />')}</blockquote>`;
        });

        /* tables */
        str = str.replace(MarkDown.Regexs.tables, match => {
            let rows = match
                .split(/\n/g)
                .filter(f => !!f)
                .map(m => m.trim()),
                align = [].slice.call(rows)
                    .filter((r: string) => !!r.match(/^(-|_|:)(-|_|:|\|)+(-|_|:)$/g))[0],
                cols: Array<{
                    align: string
                }> = align.split(/\|/g).map((m: string) => {
                    m = m.trim();

                    if (m.indexOf(':') == 0 && m.lastIndexOf(':') == m.length - 1) {
                        return { align: 'center' }
                    } else if (m.indexOf(':') == 0) {
                        return { align: 'left' };
                    } else if (m.indexOf(':') == m.length - 1) {
                        return { align: 'right' };
                    }

                    return { align: '' };
                }),
                html: Array<string> = ['<br /><table class="table table-bordered"><thead>'];

            [].slice.call(rows).forEach((row: string) => {
                let _cols = row
                    .split(/\|/g)
                    .map(m => ({ name: m.trim() }));

                if (row.match(/^(-|_|:)(-|_|:|\|)+(-|_|:)$/g)) {
                    html.push('</thead><tbody>');
                } else {
                    let body = html.indexOf('</thead><tbody>') > -1;
                    html.push(`<tr>${_cols.map((m: any, index: number) => `<t${body ? 'd' : 'h'} align="${(cols[index] || { align: '' }).align}">${m.name}</t${body ? 'd' : 'h'}>`).join('')}</tr>`)
                }
            });

            html.push('</tbody></table>');
            return html.join('');
        });

        /* mailto: */
        str = str.replace(/(&(amp;)*lt;|\<)(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))(&(amp;)*gt;|\<)/gmi, match => {
            let email = match.replace(/((\&(amp;)*lt;|\<)|(\&(amp;)*gt;|\>))/g, '');

            return `<a href="mailto:${email}">${email}</a>`;
        });

        /* links */
        str = str.replace(/!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g, (match: string) => {
            let url = match.match(/\]\(.+\)$/),
                text = match.match(/^\[.+\]\(/);

            if (text) {
                let string = text[0].replace(/(^\[|\]\($)/g, '');

                if (url) {
                    let _url = url[0].replace(/^\]\(|\)/g, '');

                    if (match.indexOf('!') !== 0) {
                        return `<a href="${_url}">${string}</a>`;
                    } else {
                        return `<img src="${_url}" alt="${string}" />`;
                    }
                }
            } else if (url) {
                let _url = url[0].replace(/^\]\(|\)/g, '');

                if (match.indexOf('!') !== 0) {
                    return `<a href="${_url}">${_url}</a>`;
                } else {
                    return `<img src="${_url}" alt="${_url}" />`;
                }
            }

            return match;
        });

        str.replace(MarkDown.Regexs.url, match => {
            //console.log(match);
            return match;
        });

        str.replace(MarkDown.Regexs.url2, match => {
            //console.log(match);
            return match;
        });

        str.replace(MarkDown.Regexs.reflinks, match => {
            console.log(match);
            return match;
        });

        //str = str.replace(/\n+(?!<pre>)(?!<h)(?!<ul>)(?!<blockquote)(?!<hr)(?!\t)([^\n]+)\n/gm, (match: string) => !!match.trim() ? `<p>${match.trim()}</p>` : '');


        /*while ((stra = MarkDown.regexobject.url.exec(str)) !== null) {
            repstr = stra[1];

            if (repstr.indexOf('://') === -1) {
                repstr = 'http://' + repstr;
            }

            str = str.replace(stra[0], '<a ' + 'href="' + repstr + '">' + repstr.replace(/(https:\/\/|http:\/\/|mailto:|ftp:\/\/)/gmi, '') + '</a>');
        }

        while ((stra = MarkDown.regexobject.reflinks.exec(str)) !== null) {
            helper1 = new RegExp('\\[' + stra[2] + '\\]: ?([^ \n]+)', "gi");

            if ((helper = helper1.exec(str)) !== null) {
                str = str.replace(stra[0], '<a ' + 'href="' + helper[1] + '">' + stra[1] + '</a>').replace(/^\s+|\s+$/g, '');
                trashgc.push(helper[0]);
            }
        }

        for (i = 0; i < trashgc.length; i++) {
            str = str.replace(trashgc[i], '');
        }

        while ((stra = MarkDown.regexobject.url2.exec(str)) !== null) {
            repstr = stra[1];
            str = str.replace(stra[0], '<a ' + 'href="' + repstr + '">' + repstr + '</a>');
        }
        
        while (match = str.match(MarkDown.regexobject.url2)) {
            let id = random.id,
                repst = match[1];

            blocks[id] = ko.utils.escape(`<a href='${repst}'>${repst}</a>`);
            str = str.replace(repst[0], `§§§${id}§§§`);
        }*/

        return ko.utils.unescape(str
            .replace(/\n/g, '§§§')
            .replace(/§{3,}/g, '§§§') // strip multi newline
            .replace(/§{3}\<h/g, '<h') // string newline in all h tag (h[1-6r])
            .replace(/h\d{1}\>§{3}/g, match => match.replace(/§{3}/g, '')) // string newline in all h tag (h[1-6r])
            .replace(/\/pre\>§{3}/g, '/pre>') // string newline in pre tag
            .replace(/§{3}\<blockquote/g, '<blockquote') // string newline in blockquote
            .replace(/\/blockquote\>§{3}/g, '/blockquote>') // string newline in blockquote
            .replace(/§{3}/g, '<br />') // match newline by br tag
            .replace(/\n/g, '')
            .replace(/h(\d{1})>(\n)*<br(\s|\/)*>/g, match => match.replace(/<br(\s|\/)*>/, ''))
            .replace(/§n/g, '\n')
        );
    };
}