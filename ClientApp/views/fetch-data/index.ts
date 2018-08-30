import * as ko from 'knockout';
import * as $ from 'jquery';

import { component } from '../../common';


interface IEmployee {
    id: number;
    name: string;
    gender: number;
    position: number;
    department: number;
    memo: string;
}

@component({
    url: 'ajax/fetch-data',
    icon: 'fa fa-refresh',
    name: 'fetch-data',
    template: require('./index.html')
})
export class FetchDataViewModel {
    public forecasts = ko.observableArray<IEmployee>();

    constructor() {
        $.ajax({
            url: '/json/employee.json',
            data: {},
            success: (data) => {
                this.forecasts(data);
            },
            error: (msg) => {
            }
        });
    }
}
