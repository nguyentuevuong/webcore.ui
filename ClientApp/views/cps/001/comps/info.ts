import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    name: 'cps001-infomation',
    styles: `.infomation {
        width: 640px;
        height: 120px;
        display: inline-block;
        border: 1px solid #ccc;
        border-top: 4px solid #2ECC71;
    }`,
    template: `<div class="infomation"></div>`
})
export class Cps001aInfoComponent {
}