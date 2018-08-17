import { component } from "../../decorator/component";
import { IRoute, Router, Routes } from "../../common/router";

@component({
    name: 'top-menu',
    styles: require('./top-menu.css'),
    template: require('./top-menu.html')
})
export class TopMenuViewModel {
    public router: Router;
    public routes: IRoute[] = Routes;

    constructor(params: any) {
        this.router = params.router;
    }
}