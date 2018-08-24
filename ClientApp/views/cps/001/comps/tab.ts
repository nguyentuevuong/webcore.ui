import * as ko from 'knockout';

import { component } from '../../../../decorator/component';

@component({
    name: 'cps001-tab',
    styles: `.tab-content {
    }`,
    template: `<ul class="nav nav-tabs noselect">
        <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#home">Layout</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#profile">Category</a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade show active" id="home">
            <p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua,
                retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.
                Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure
                terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan
                american apparel, butcher voluptate nisi qui.</p>
        </div>
        <div class="tab-pane fade" id="profile">
            <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation
                +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table
                craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean
                shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna
                delectus mollit.
            </p>
        </div>
    </div>`
})
export class Cps001aTabComponent {
}