import { component } from '../../../decorator/component';
import * as $ from 'jquery';
import * as ko from 'knockout';

@component({
    name: 'deferred3',
    template: require('./deferred.3.html')
})
class Deferred3ViewModel {
    type: string = '';
    starttime: number = 0;

    pageSize: KnockoutObservable<number> = ko.observable(0);
    pageIndex: KnockoutObservable<number> = ko.observable(1);
    currentPageData: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any) {
        let self = this,
            loadData = () => {
                let pageSize = ko.toJS(self.pageSize),
                    pageIndex = ko.toJS(self.pageIndex);

                // take start time
                self.starttime = new Date().getTime();

                self.currentPageData([]);
                $.getJSON('/json/deferred.json', {}, self.currentPageData);
                /*for (let row = pageIndex * pageSize + 1; row < pageIndex * pageSize + pageSize; row++) {
                    self.currentPageData.push({
                        name: `Name ${row}`,
                        position: `Position ${row}`,
                        location: `Location ${row}`
                    });
                }*/
            };

        self.type = params.type;

        if (params.type != 'deferred') {

            ko.computed(loadData, self);
            //self.currentPageData = ko.observableArray([]);
        } else {
            ko.computed(loadData, self).extend({ deferred: true });
            //self.currentPageData = ko.observableArray([]).extend({ deferred: true });
        }
    }

    // calc process time
    timing = () => {
        let self = this;
        return self.starttime ? new Date().getTime() - self.starttime : 0;
    }
}