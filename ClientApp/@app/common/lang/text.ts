import { ko } from '@app/providers';
import { i18n, lang } from '@app/common/lang';

// sua ham nay de get resource nhung va dung cho ham computed o bind i18n
export const getText: any = (resource: string, params?: { [key: string]: string }) => {
    return ((i18n[ko.toJS(lang)][resource.replace('#', '')] || '')
        .replace(/#{.+}/g, (match: string) => {
            let exist: string = (params || {})[match.replace(/[\#\{\}]/g, '')] || '';

            return getText(exist.replace('#', ''), params);
        }) || resource).toString();
}


/*
export const getText = (resource: string, params?: Array<string>) =>  _getText(resource, params);

function _getText(resource: string, params?: Array<string>): string {
    return (i18n[ko.toJS(lang)][resource.replace('#', '')] || '').replace(/\#\{*\}/g, function (match: string) { return _getText(match.replace(/[\#\{\}])/g, '')) }) || '';
}
*/