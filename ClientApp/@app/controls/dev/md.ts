import { ko } from '@app/providers';
import { md } from '@app/common/utils';
import { handler } from '@app/common/ko';

@handler({
    virtual: false,
    bindingName: 'markdown'
})
export class I18nBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext) => {
        ko.utils.setHtml(element, md.parse(ko.toJS(valueAccessor()) || ""));

        ko.applyBindingsToDescendants({}, element);

        return { controlsDescendantBindings: true };
    }
}

/***   Regex Markdown Parser by chalarangelo   ***/
// Replaces 'regex' with 'replacement' in 'str'
// Curry function, usage: replaceRegex(regexVar, replacementVar) (strVar)
const replaceRegex = function (regex: RegExp, replacement: (match: string, tag1?: string, tag2?: string, tag3?: string, tag4?: string) => string) {
    return function (str: string) {
        return str.replace(regex, replacement);
    }
}
// Regular expressions for Markdown (a bit strict, but they work)
const codeBlockRegex = /((\n\t)(.*))+/g;
const inlineCodeRegex = /(`)(.*?)\1/g;
const imageRegex = /!\[([^\[]+)\]\(([^\)]+)\)/g;
const linkRegex = /\[([^\[]+)\]\(([^\)]+)\)/g;
const headingRegex = /\n(#+\s*)(.*)/g;
const boldItalicsRegex = /(\*{1,2})(.*?)\1/g;
const strikethroughRegex = /(\~\~)(.*?)\1/g;
const blockquoteRegex = /\n(&gt;|\>)(.*)/g;
const horizontalRuleRegex = /\n((\-{3,})|(={3,}))/g;
const unorderedListRegex = /(\n\s*(\-|\+)\s.*)+/g;
const orderedListRegex = /(\n\s*([0-9]+\.)\s.*)+/g;
const paragraphRegex = /\n+(?!<pre>)(?!<h)(?!<ul>)(?!<blockquote)(?!<hr)(?!\t)([^\n]+)\n/g;
/*

// Replacer functions for Markdown
const codeBlockReplacer = function (fullMatch: string) {
    return '\n<pre>' + fullMatch + '</pre>';
}
const inlineCodeReplacer = function (fullMatch: string, tagStart: string, tagContents: string) {
    return '<code>' + tagContents + '</code>';
}
const imageReplacer = function (fullMatch: string, tagTitle: string, tagURL: string) {
    return '<img src="' + tagURL + '" alt="' + tagTitle + '" />';
}
const linkReplacer = function (fullMatch: string, tagTitle: string, tagURL: string) {
    return '<a href="' + tagURL + '">' + tagTitle + '</a>';
}
const headingReplacer = function (fullMatch: string, tagStart: string, tagContents: string) {
    return '\n<h' + tagStart.trim().length + '>' + tagContents + '</h' + tagStart.trim().length + '>';
}
const boldItalicsReplacer = function (fullMatch: string, tagStart: string, tagContents: string) {
    return '<' + ((tagStart.trim().length == 1) ? ('em') : ('strong')) + '>' + tagContents + '</' + ((tagStart.trim().length == 1) ? ('em') : ('strong')) + '>';
}
const strikethroughReplacer = function (fullMatch: string, tagStart: string, tagContents: string) {
    return '<del>' + tagContents + '</del>';
}
const blockquoteReplacer = function (fullMatch: string, tagStart: string, tagContents: string) {
    return '\n<blockquote>' + tagContents + '</blockquote>';
}
const horizontalRuleReplacer = function (fullMatch: string) {
    return '\n<hr />';
}
const unorderedListReplacer = function (fullMatch: string) {
    let items = '';
    fullMatch.trim().split('\n').forEach((item: string) => { items += '<li>' + item.substring(2) + '</li>'; });
    return '\n<ul>' + items + '</ul>';
}
const orderedListReplacer = function (fullMatch: string) {
    let items = '';
    fullMatch.trim().split('\n').forEach((item: string) => { items += '<li>' + item.substring(item.indexOf('.') + 2) + '</li>'; });
    return '\n<ol>' + items + '</ol>';
}
const paragraphReplacer = function (fullMatch: string, tagContents: string) {
    return '<p>' + tagContents + '</p>';
}
// Rules for Markdown parsing (use in order of appearance for best results)
const replaceCodeBlocks = replaceRegex(codeBlockRegex, codeBlockReplacer);
const replaceInlineCodes = replaceRegex(inlineCodeRegex, inlineCodeReplacer);
const replaceImages = replaceRegex(imageRegex, imageReplacer);
const replaceLinks = replaceRegex(linkRegex, linkReplacer);
const replaceHeadings = replaceRegex(headingRegex, headingReplacer);
const replaceBoldItalics = replaceRegex(boldItalicsRegex, boldItalicsReplacer);
const replaceceStrikethrough = replaceRegex(strikethroughRegex, strikethroughReplacer);
const replaceBlockquotes = replaceRegex(blockquoteRegex, blockquoteReplacer);
const replaceHorizontalRules = replaceRegex(horizontalRuleRegex, horizontalRuleReplacer);
const replaceUnorderedLists = replaceRegex(unorderedListRegex, unorderedListReplacer);
const replaceOrderedLists = replaceRegex(orderedListRegex, orderedListReplacer);
const replaceParagraphs = replaceRegex(paragraphRegex, paragraphReplacer);
// Fix for tab-indexed code blocks
const codeBlockFixRegex = /\n(<pre>)((\n|.)*)(<\/pre>)/g;
const codeBlockFixer = function (fullMatch: string, tagStart: string, tagContents: string, lastMatch: string, tagEnd: string) {
    let lines = '';
    tagContents.split('\n').forEach((line: string) => { lines += line.substring(1) + '\n'; });
    return tagStart + lines + tagEnd;
}
const fixCodeBlocks = replaceRegex(codeBlockFixRegex, codeBlockFixer);
// Replacement rule order function for Markdown
// Do not use as-is, prefer parseMarkdown as seen below
const replaceMarkdown = function (str: string) {
    return replaceParagraphs(replaceOrderedLists(replaceUnorderedLists(
        replaceHorizontalRules(replaceBlockquotes(replaceceStrikethrough(
            replaceBoldItalics(replaceHeadings(replaceLinks(replaceImages(
                replaceInlineCodes(replaceCodeBlocks(str))
            ))))
        )))
    )));
}
// Parser for Markdown (fixes code, adds empty lines around for parsing)
// Usage: parseMarkdown(strVar)
const parseMarkdown = function (str: string) {
    return fixCodeBlocks(replaceMarkdown('\n' + str + '\n')).trim();
}
*/