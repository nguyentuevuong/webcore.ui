import { component } from '@app/common/ko';
import * as ko from 'knockout';

const data = [
    {
        name: 'Alfred',
        position: 'Butler',
        location: 'London'
    },
    {
        name: 'Bruce',
        position: 'Chairman',
        location: 'New York'
    }
];

@component({
    name: 'deferred1',
    template: require('./deferred.1.html')
})
class Deferred1ViewModel {
    type = '';
    starttime: number = 0;
    data: KnockoutObservableArray<any> = ko.observableArray([]);
    constructor(params: any) {
        let self = this;
        self.type = params.type;

        //ko.options.deferUpdates = (self.type == 'deferred');

        if (self.type !== 'deferred') {
            self.data = ko.observableArray(data);
        } else {
            self.data = ko.observableArray(data).extend({ deferred: true });
        }
    }

    flipData = () => {
        let self = this,
            _data = ko.toJS(self.data);

        // take start time
        self.starttime = new Date().getTime();

        for (var i = 0; i < 999; i++) {
            self.data([]);
            self.data(_data.reverse());
        }
    }

    // calc process time
    timing = () => {
        let self = this;
        return self.starttime ? new Date().getTime() - self.starttime : 0;
    }
}