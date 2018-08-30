import * as ko from 'knockout';

import { component } from '../../common';

@component({
    url: '/count/counter',
    icon: 'fa fa-pie-chart',
    title: 'Counter sample',
    template: require('./index.html')
})
export class CounterExampleViewModel {
    public currentCount = ko.observable(0);

    public incrementCounter() {
        let prevCount = this.currentCount();
        this.currentCount(prevCount + 1);
    }
}