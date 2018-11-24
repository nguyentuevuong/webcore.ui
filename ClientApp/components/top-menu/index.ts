import { component } from "@app/common/ko";
import { Router } from '@app/common/router';
import { menu, IMenu } from '@app/common/utils/menu';

@component({
    name: 'top-menu',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class TopMenuViewModel {
    router: Router;
    routes: IMenu[] = menu.top;

    constructor(params: { router: Router }) {
        this.router = params.router;
    }
}