import { ko } from '@app/providers';
import { random } from '@app/common/id';
import { Markdown } from 'highlight-ts';

export { MarkDown as md };

export class MarkDown {
    private static blocks: {
        [key: string]: string
    } = {};

    private static regexobject: {
        [key: string]: RegExp
    } = {
            headline: /^(\#{1,6})([^\#\n]+)$/m,
            code: /\s\`\`\`\n?([^`]+)\`\`\`/g,
            hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
            lists: /^((\s*(\*|\d\.) [^\n]+)\n)+/gm, // /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
            bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
            links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
            reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
            mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
            tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
            include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
            url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g,
            url2: /[ \t\n]([a-zA-Z]{2,16}:\/\/[a-zA-Z0-9@:%_\+.~#?&=]{2,256}.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)[ \t\n]/g
        };

    static parse(str: string) {
        let line, nstatus = 0,
            status,
            cel,
            calign: Array<any>,
            indent: number | boolean = 0,
            helper: RegExpExecArray | Array<any> | string | null,
            helper1,
            helper2,
            count,
            repstr: string = '',
            stra,
            trashgc = [],
            casca = 0,
            i = 0,
            j = 0;


        /* headlines */
        while ((stra = MarkDown.regexobject.headline.exec(str)) !== null) {
            let id = random.id;

            count = stra[1].length;

            MarkDown.blocks[id] = ko.utils.escape(`<h${count}>${stra[2].trim()}</h${count}>`);

            str = str.replace(stra[0], '§§§' + id + '§§§');
        }

        /* code */
        while ((stra = MarkDown.regexobject.code.exec(str)) !== null) {
            let id = random.id,
                code = stra[1].replace(/\s+/g, ' ').trim();

            MarkDown.blocks[id] = ko.utils.escape(`<pre>${code}</pre>`);

            str = str.replace(stra[0], '§§§' + id + '§§§');
        }

        /* lists */
        while ((stra = MarkDown.regexobject.lists.exec(str)) !== null) {
            let id = random.id;

            casca = 0;

            if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
                repstr = '<ul>';
            } else {
                repstr = '<ol>';
            }

            helper = stra[0].split('\n');
            helper1 = [];
            status = 0;
            indent = false;

            for (i = 0; i < helper.length; i++) {
                if ((line = /^((\s*)((\*|\-)|\d(\.|\))) ([^\n]+))/.exec(helper[i])) !== null) {
                    if ((line[2] === undefined) || (line[2].length === 0)) {
                        nstatus = 0;
                    } else {
                        if (indent === false) {
                            indent = line[2].replace(/\t/, '    ').length;
                        }
                        nstatus = Math.round(line[2].replace(/\t/, '    ').length / indent);
                    }

                    while (status > nstatus) {
                        repstr += helper1.pop();
                        status--;
                        casca--;
                    }

                    while (status < nstatus) {
                        if ((line[0].trim().substr(0, 1) === '*') || (line[0].trim().substr(0, 1) === '-')) {
                            repstr += '<ul>';
                            helper1.push('</ul>');
                        } else {
                            repstr += '<ol>';
                            helper1.push('</ol>');
                        }
                        status++;
                        casca++;
                    }
                    repstr += '<li>' + line[6] + '</li>' + '\n';
                }
            }

            while (casca > 0) {
                repstr += '</ul>';
                casca--;
            }

            if ((stra[0].trim().substr(0, 1) === '*') || (stra[0].trim().substr(0, 1) === '-')) {
                repstr += '</ul>';
            } else {
                repstr += '</ol>';
            }

            //MarkDown.blocks[id] = ko.utils.escape(`${repstr}<br />`);
            //str = str.replace(stra[0], '§§§' + id + '§§§');

            str = str.replace(stra[0], repstr + '\n');
        }


        debugger;

        /* tables */
        while ((stra = MarkDown.regexobject.tables.exec(str)) !== null) {
            repstr = '<table class="table"><tr>';
            helper = stra[1].split('|');
            calign = stra[4].split('|');

            for (i = 0; i < helper.length; i++) {
                if (calign.length <= i) {
                    calign.push(0);
                } else if (calign[i].trimRight().slice(-1) === ':') {
                    if (calign[i][0] === ':') {
                        calign[i] = 3;
                    } else {
                        calign[i] = 2;
                    }
                } else {
                    calign[i] = 0;
                }
            }

            cel = ['<th>', '<th align="left">', '<th align="right">', '<th align="center">'];

            for (i = 0; i < helper.length; i++) {
                repstr += cel[calign[i]] + helper[i].trim() + '</th>';
            }

            repstr += '</tr>';
            cel = ['<td>', '<td align="left">', '<td align="right">', '<td align="center">'];
            helper1 = stra[7].split('\n');

            for (i = 0; i < helper1.length; i++) {
                helper2 = helper1[i].split('|');

                if (helper2[0].length !== 0) {

                    while (calign.length < helper2.length) {
                        calign.push(0);
                    }

                    repstr += '<tr>';

                    for (j = 0; j < helper2.length; j++) {
                        repstr += cel[calign[j]] + helper2[j].trim() + '</td>';
                    }
                    repstr += '</tr>' + '\n';
                }
            }

            repstr += '</table>';
            str = str.replace(stra[0], repstr);
        }

        /* bold and italic */
        for (i = 0; i < 3; i++) {
            while ((stra = MarkDown.regexobject.bolditalic.exec(str)) !== null) {
                let _repstr: Array<string> = [];

                if (stra[1] === '~~') {
                    str = str.replace(stra[0], '<del>' + stra[2] + '</del>');
                } else {
                    switch (stra[1].length) {
                        case 1:
                            _repstr = ['<i>', '</i>'];
                            break;
                        case 2:
                            _repstr = ['<b>', '</b>'];
                            break;
                        case 3:
                            _repstr = ['<i><b>', '</b></i>'];
                            break;
                    }

                    str = str.replace(stra[0], _repstr[0] + stra[2] + _repstr[1]);
                }
            }
        }

        /* links */
        while ((stra = MarkDown.regexobject.links.exec(str)) !== null) {
            if (stra[0].substr(0, 1) === '!') {
                str = str.replace(stra[0], '<img src="' + stra[2] + '" alt="' + stra[1] + '" title="' + stra[1] + '" />');
            } else {
                str = str.replace(stra[0], '<a ' + 'href="' + stra[2] + '">' + stra[1] + '</a>');
            }
        }
        
        /* horizontal line */
        while ((stra = MarkDown.regexobject.hr.exec(str)) !== null) {
            let id = random.id;

            MarkDown.blocks[id] = ko.utils.escape(`\n<hr/>\n`);

            str = str.replace(stra[0], '§§§' + id + '§§§');
        }

        while ((stra = MarkDown.regexobject.mail.exec(str)) !== null) {
            str = str.replace(stra[0], '<a href="mailto:' + stra[1] + '">' + stra[1] + '</a>');
        }

        while ((stra = MarkDown.regexobject.url.exec(str)) !== null) {
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

        /* include */
        while ((stra = MarkDown.regexobject.include.exec(str)) !== null) {
            helper = stra[2].replace(/[\.\:\/]+/gm, '');
            helper1 = '';

            helper1 = document.getElementById(helper)!.innerHTML.trim();

            if ((stra[1] === 'csv') && (helper1 !== '')) {
                let helper2: any = {
                    ';': [],
                    '\t': [],
                    ',': [],
                    '|': []
                };

                helper1 = helper1.split('\n');
                helper2[0] = [';', '\t', ',', '|'];

                for (j = 0; j < helper2[0].length; j++) {
                    for (i = 0; i < helper1.length; i++) {
                        if (i > 0) {
                            if (helper2[helper2[0][j]] !== false) {
                                if ((helper2[helper2[0][j]][i] !== helper2[helper2[0][j]][i - 1]) || (helper2[helper2[0][j]][i] === 1)) {
                                    helper2[helper2[0][j]] = false;
                                }
                            }
                        }
                    }
                }
                if ((helper2[';'] !== false) || (helper2['\t'] !== false) || (helper2[','] !== false) || (helper2['|'] !== false)) {
                    if (helper2[';'] !== false) {
                        helper2 = ';';
                    } else if (helper2['\t']) {
                        helper2 = '\t';
                    } else if (helper2[',']) {
                        helper2 = ',';
                    } else if (helper2['|']) {
                        helper2 = '|';
                    }
                    repstr = '<table>';
                    for (i = 0; i < helper1.length; i++) {
                        helper = helper1[i].split(helper2);
                        repstr += '<tr>';
                        for (j = 0; j < helper.length; j++) {
                            repstr += '<td>' + MarkDown.htmlEncode(helper[j]) + '</td>';
                        }
                        repstr += '</tr>';
                    }
                    repstr += '</table>';
                    str = str.replace(stra[0], repstr);
                } else {
                    str = str.replace(stra[0], '<code>' + helper1.join('\n') + '</code>');
                }
            } else {
                str = str.replace(stra[0], '');
            }
        }

        str = str.replace(/[\s]{2,}[\n]{1,}/gmi, '<br/>');

        //str = str.replace(/[\n]{2,}/gmi, '<br/><br/>');

        ko.utils.objectForEach(MarkDown.blocks, (key: string, value: string) => {
            str = str.replace('§§§' + key + '§§§', ko.utils.unescape(value));
        });

        return str;
    };

    private static htmlEncode(str: string) {
        let div = document.createElement('div');

        div.appendChild(document.createTextNode(str));

        return div.innerHTML;
    };
}