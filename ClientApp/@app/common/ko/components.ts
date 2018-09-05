import { History } from 'history';

export interface IComponent {
    url?: string;
    name?: string;
    icon?: string;
    title?: string;
    params?: any;
    viewModel?: any;
    history?: History;
    component?: any
}

// Declare the client-side routing configuration
export const Components: IComponent[] = [];