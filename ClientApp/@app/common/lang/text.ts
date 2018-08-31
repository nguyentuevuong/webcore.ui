import { ko } from '@app/providers';
import { i18n, lang } from '@app/common/lang';

// sua ham nay de get resource nhung va dung cho ham computed o bind i18n
export const getText = (resource: string) => i18n[ko.toJS(lang)][resource.replace('#', '')];