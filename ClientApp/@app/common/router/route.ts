export const route: IRoute = { goto: (url: string, params: any) => { } };

export interface IRoute {
    goto: (url: string, params: any) => void
}