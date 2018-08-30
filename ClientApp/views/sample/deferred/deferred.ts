import { component } from '../../../common';
import * as ko from 'knockout';

@component({
    url: 'sample/deferred',
    title: 'Deferred',
    icon: 'fa fa-refresh',
    template: `
        <h3>Sample deffered</h3>
        <hr />
        <div class="row">
            <deferred1 params="{ type: 'deferred' }" class='col-md-6'></deferred1>
            <deferred1 params="{ type: 'standard' }" class='col-md-6'></deferred1>
        </div>
        <hr />
        <div class="row">
            <deferred2 params="{ type: 'deferred' }" class='col-md-6'></deferred2>
            <deferred2 params="{ type: 'standard' }" class='col-md-6'></deferred2>
        </div>
        <hr />
        <div class="row">
            <deferred3 params="{ type: 'deferred' }" class='col-md-6'></deferred3>
            <deferred3 params="{ type: 'standard' }" class='col-md-6'></deferred3>
        </div>
    `
})
export class SampleDeferredViewModel {
    constructor(params: any) {

    }
}