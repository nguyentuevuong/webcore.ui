import { History } from 'history';

export interface IRoute {
    url?: string;
    title?: string;
    params?: any;
    viewModel?: any;
    history?: History
}

// Declare the client-side routing configuration
export const Routes: IRoute[] = [];