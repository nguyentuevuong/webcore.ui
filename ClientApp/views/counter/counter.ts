import * as ko from 'knockout';

import {component} from '../../decorator/component';

@component({
    url: '/count/counter',
    icon: 'fa fa-pie-chart',
    title: 'Counter sample',
    template: require('./counter.html')
})
export class CounterExampleViewModel {
    public currentCount = ko.observable(0);

    public incrementCounter() {
        let prevCount = this.currentCount();
        this.currentCount(prevCount + 1);
    }
}