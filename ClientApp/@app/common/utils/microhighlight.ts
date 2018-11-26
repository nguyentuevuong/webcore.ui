/* Unobtrustive Code Highlighter By Dan Webb 11/2005
   Version: 0.4
	
	Usage:
		Add a script tag for this script and any stylesets you need to use
		to the page in question, add correct class names to CODE elements, 
		define CSS styles for elements. That's it! 
	
	Known to work on:
		IE 5.5+ PC
		Firefox/Mozilla PC/Mac
		Opera 7.23 + PC
		Safari 2
		
	Known to degrade gracefully on:
		IE5.0 PC
	
	Note: IE5.0 fails due to the use of lookahead in some stylesets.  To avoid script errors
	in older browsers use expressions that use lookahead in string format when defining stylesets.
	
	This script is inspired by star-light by entirely cunning Dean Edwards
	http://dean.edwards.name/star-light/.  
*/

class CodeHighlighter {
    static styleSets: Array<any> = [];

    static addStyle(name: string, rules: any) {

        // using push test to disallow older browsers from adding styleSets
        this.styleSets.push({
            name: name,
            rules: rules,
            ignoreCase: arguments[2] || false
        });

        // only set the event when the first style is added
        if (this.styleSets.length == 1) {
            // set highlighter to run on load (use LowPro if present)
            let old = window.onload;

            if (!old) {
                window.onload = function () { CodeHighlighter.init() };
            } else {
                window.onload = function () {
                    if (old) {
                        old.apply(window);
                    }

                    CodeHighlighter.init();
                }
            }
        }
    }

    static init() {
        // throw out older browsers
        if (!document.getElementsByTagName) {
            return;
        }

        let rules: Array<any> = [],
            codeEls = [].slice.call(document.querySelectorAll("code"));

        // joins regexes into one big parallel regex
        rules.toString = () => rules.map(m => m.exp).join("|");

        function addRule(className: string, rule: any) {
            // add a replace rule
            var exp = (typeof rule.exp != "string") ? String(rule.exp).substr(1, String(rule.exp).length - 2) : rule.exp;
            // converts regex rules to strings and chops of the slashes
            rules.push({
                className: className,
                exp: "(" + exp + ")",
                length: (exp.match(/(^|[^\\])\([^?]/g) || "").length + 1, // number of subexps in rule
                replacement: rule.replacement || null
            });
        }

        function parse(text: string, ignoreCase: boolean) {
            // main text parsing and replacement
            return text.replace(new RegExp(rules.toString(), (ignoreCase) ? "gi" : "g"), function () {
                let i = 0,
                    j = 1,
                    rule;

                while (rule = rules[i++]) {
                    if (arguments[j]) {
                        // if no custom replacement defined do the simple replacement
                        if (!rule.replacement) {
                            return "<span class=\"" + rule.className + "\">" + arguments[0] + "</span>";
                        } else {
                            // replace $0 with the className then do normal replaces
                            var str = rule.replacement.replace("$0", rule.className);

                            for (var k = 1; k <= rule.length - 1; k++) {
                                str = str.replace("$" + k, arguments[j + k]);
                            }

                            return str;
                        }
                    } else {
                        j += rule.length;
                    }
                }
            });
        }

        function highlightCode(styleSet: any) {
            // clear rules array
            let parsed,
                clsRx = new RegExp("(\\s|^)" + styleSet.name + "(\\s|$)"),
                // get stylable elements by filtering out all code elements without the correct className	
                stylableEls = codeEls.filter(function (item: any) { return clsRx.test(item.className) });

            // reset size of rulesjbo
            rules.length = 0;

            // add style rules to parser
            for (var className in styleSet.rules) {
                addRule(className, styleSet.rules[className]);
            }


            // replace for all elements
            for (var i = 0; i < stylableEls.length; i++) {
                // EVIL hack to fix IE whitespace badness if it's inside a <pre>
                if (/MSIE/.test(navigator.appVersion) && stylableEls[i].parentNode.nodeName == 'PRE') {
                    stylableEls[i] = stylableEls[i].parentNode;

                    parsed = stylableEls[i].innerHTML.replace(/(<code[^>]*>)([^<]*)<\/code>/i, function () {
                        return arguments[1] + parse(arguments[2], styleSet.ignoreCase) + "</code>"
                    });

                    parsed = parsed.replace(/\n( *)/g, function () {
                        var spaces = "";

                        for (var i = 0; i < arguments[1].length; i++) {
                            spaces += "&nbsp;";
                        }

                        return "\n" + spaces;
                    });

                    parsed = parsed.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                    parsed = parsed.replace(/\n(<\/\w+>)?/g, "<br />$1").replace(/<br \/>[\n\r\s]*<br \/>/g, "<p><br></p>");

                } else {
                    parsed = parse(stylableEls[i].innerHTML, styleSet.ignoreCase);
                }

                stylableEls[i].innerHTML = parsed;
            }
        }

        // run highlighter on all stylesets
        [].slice.call(this.styleSets)
            .forEach((style: any) => {
                highlightCode(style);
            });
    }
}

CodeHighlighter.addStyle("html", {
    comment: {
        exp: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
    },
    tag: {
        exp: /(&lt;\/?)([a-zA-Z]+\s?)/,
        replacement: "$1<span class=\"$0\">$2</span>"
    },
    string: {
        exp: /'[^']*'|"[^"]*"/
    },
    attribute: {
        exp: /\b([a-zA-Z-:]+)(=)/,
        replacement: "<span class=\"$0\">$1</span>$2"
    },
    value: {
        exp: /"([a-zA-Z0-9])+"/
    },
    doctype: {
        exp: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
    }
});

CodeHighlighter.addStyle("css", {
    comment: {
        exp: /\/\*[^*]*\*+([^\/][^*]*\*+)*\//
    },
    keywords: {
        exp: /@\w[\w\s]*/
    },
    selectors: {
        exp: "([\\w-:\\[.#][^{};>]*)(?={)"
    },
    properties: {
        exp: "([\\w-]+)(?=\\s*:)"
    },
    units: {
        exp: /([0-9])(em|en|px|%|pt)\b/,
        replacement: "$1<span class=\"$0\">$2</span>"
    },
    urls: {
        exp: /url\([^\)]*\)/
    }
});

CodeHighlighter.addStyle("javascript", {
    comment: {
        exp: /(\/\/[^\n]*(\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
    },
    brackets: {
        exp: /\(|\)/
    },
    string: {
        exp: /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"/
    },
    keywords: {
        exp: /\b(arguments|break|case|continue|default|delete|do|else|for|function|if|in|instanceof|new|null|return|switch|typeof|var|void|while|with)\b/
    },
    global: {
        exp: /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/
    },
    typeof: {
        exp: /\b(this|true|false|Date|Number|String)\b/
    },
    prop: {
        exp: /\.([a-zA-Z0-9_])+\b/
    }
});

CodeHighlighter.addStyle("python", {
    comment: {
        exp: /#[^\n]+/
    },
    brackets: {
        exp: /\(|\)/
    },
    string: {
        exp: /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"|""".*"""/
    },
    keywords: {
        exp: /\b(and|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|yield|as|None)\b/
    }
});

CodeHighlighter.addStyle("ruby", {
    comment: {
        exp: /#[^\n]+/
    },
    brackets: {
        exp: /\(|\)/
    },
    string: {
        exp: /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"/
    },
    keywords: {
        exp: /\b(do|end|self|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|raise)\b/
    },
    /* Added by Shelly Fisher (shelly@agileevolved.com) */
    symbol: {
        exp: /([^:])(:[A-Za-z0-9_!?]+)/
    }
});