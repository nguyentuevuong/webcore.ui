export const i18n: {
    [lang: string]: {
        [key: string]: string
    }
} = {
    'en': {
        'en': 'English',
        'vi': 'Tiếng Việt'
    },
    'vi': {
        'en': 'English',
        'vi': 'Tiếng Việt'
    }
};

export interface Ii18n {
    html?: string;
    text?: string;
    title?: string;
    placeholder?: string;
}