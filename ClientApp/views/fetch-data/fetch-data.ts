import * as ko from 'knockout';
import * as $ from 'jquery';

import {component} from '../../decorator/component';


interface IEmployee {
    id: number;
    name: string;
    gender: number;
    position: number;
    department: number;
    memo: string;
}

@component({
    url: 'fetch',
    icon: 'fa fa-refresh',
    name: 'fetch-data',
    template: require('./fetch-data.html')
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

        /*fetch('/api/company/find')
            .then(response => response.json() as Promise<ICompany[]>)
            .then(data => {
                this.forecasts(data);
            });*/
    }
}
