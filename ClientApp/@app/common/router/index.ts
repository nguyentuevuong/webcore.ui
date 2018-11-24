export * from '@app/common/router/router';

export const route = { goto: (url: string, params: any) => history.pushState(params, url) };