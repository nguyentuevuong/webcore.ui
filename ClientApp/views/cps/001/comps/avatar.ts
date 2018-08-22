import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    name: 'cps001-avatar',
    styles: `.avatar {
        width: 90px;
        height: 120px;
        display: inline-block;
        border: 1px solid #ccc;
        border-top: 4px solid #2ECC71;
    }`,
    template: `<div class="avatar"></div>`
})
export class Cps001aAvatarComponent {
}