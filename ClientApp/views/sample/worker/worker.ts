import { component } from '../../../common/component';
import * as ko from 'knockout';

import '../../../common/worker-ext';

interface FunctionConstructor {
    toWorker(): Worker
}

@component({
    url: 'sample/worker',
    title: 'Worker',
    icon: 'fa fa-cogs',
    template: `
        <h3>Sample worker</h3>
        <hr />
        <div class="row">
            <div class='col-md-6'>
                <span data-bind="text: tws5"></span>
                <pre data-bind="text: ko.toJSON(worker5, null, 4)"></pre>
                <span data-bind="text: twe5"></span>
            </div>
            <div class='col-md-6'>
                <span data-bind="text: tws1"></span>
                <pre data-bind="text: ko.toJSON(worker1, null, 4)"></pre>
                <span data-bind="text: twe1"></span>
            </div>
        </div>
        <hr />
        <button class="btn btn-secondary" data-bind="click: load">Load data</button>
    `
})
export class SampleDeferredViewModel {
    tws5: KnockoutObservable<string> = ko.observable('');
    twe5: KnockoutObservable<string> = ko.observable('');
    worker5: KnockoutObservable<any> = ko.observable({});

    tws1: KnockoutObservable<string> = ko.observable('');
    twe1: KnockoutObservable<string> = ko.observable('');
    worker1: KnockoutObservable<any> = ko.observable({});

    load = () => {
        let self = this,
            // Define two worker
            d5 = new Worker('/nippo/api/worker/delay5.js'), // delay 5000 mls
            d1 = new Worker('/nippo/api/worker/delay1.js'); // delay 1000 mls

        // clear data
        self.tws1('');
        self.twe1('');
        self.worker1({});

        self.tws5('');
        self.twe5('');
        self.worker5({});

        // define message receive event for d1 (worker 1)
        d1.onmessage = (msg: any) => {
            // d1 receive data
            self.worker1(msg.data);
            self.twe1(String(`Finish at: ${new Date().toISOString()}`));
        };

        // define message receive event for d5 (worker 5)
        d5.onmessage = (msg: any) => {
            // d5 receive data
            self.worker5(msg.data);
            self.twe5(String(`Finish at: ${new Date().toISOString()}`));
        };

        // d5 call first
        self.tws5(String(`Start at: ${new Date().toISOString()}`));
        d5.postMessage({});

        // d1 call after
        self.tws1(String(`Start at: ${new Date().toISOString()}`));
        d1.postMessage({});
    }
}