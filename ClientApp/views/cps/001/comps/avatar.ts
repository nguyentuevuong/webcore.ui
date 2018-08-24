import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    name: 'cps001-avatar',
    styles: `.avatar {
        width: 90px;
        height: 120px;
        display: inline-block;
    }`,
    template: `<div class="avatar header-panel"></div>`
})
export class Cps001aAvatarComponent {
}