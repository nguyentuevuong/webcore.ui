import { component } from '../../../decorator/component';

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as ko from 'knockout';

@component({
    name: 'deferred2',
    template: require('./deferred.2.html')
})
class Deferred2ViewModel {
    type = '';
    starttime: number = 0;
    data: KnockoutObservableArray<any> = ko.observableArray([]);
    constructor(params: any) {
        let self = this;
        self.type = params.type;

        if (self.type !== 'deferred') {
            self.data = ko.observableArray([]);
        } else {
            self.data = ko.observableArray([]).extend({ deferred: true });
        }
    }

    loadData = () => {
        let self = this;

        // take start time
        self.starttime = new Date().getTime();

        self.data([]);

        $.getJSON('/json/deferred.json', {}, (data: Array<any>) => {
            _.each(data, d => {
                self.data.push(d);
            });
        });
    }

    // calc process time
    timing = () => {
        let self = this;
        return self.starttime ? new Date().getTime() - self.starttime : 0;
    }
}