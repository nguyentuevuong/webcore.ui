import { component } from '@app/common/ko';

@component({
    name: 'cps001-buttons',
    styles: `.buttons {
        width: 160px;
        height: 120px;
        display: inline-block;
    }
    .columns {
        width: 50%;
        display: inline-block;
    }
    `,
    template: `<div class="buttons header-panel">
        <div class="columns">
            <button class="btn btn-secondary btn-block">Map</button>
            <button class="btn btn-secondary btn-block">Documents</button>
        </div>
        <div class="columns">
            <button class="btn btn-secondary btn-block">Documents</button>
        </div>
    </div>`
})
export class Cps001aButtonComponent {
}