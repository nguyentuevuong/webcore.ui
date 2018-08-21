import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    url: '/update-employee-info',
    title: '#cps001_title',
    icon: 'fa fa-globe',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class Cps001aViewModel {

    constructor(params: any, element: HTMLElement) {

    }
}