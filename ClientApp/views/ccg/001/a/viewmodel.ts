import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    name: 'ccg-001',
    styles: require('./style.css'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class Ccg001aViewModel {

    constructor(params: any, element: HTMLElement) {

    }
}