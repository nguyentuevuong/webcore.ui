import { ko } from '@app/providers';
import { fetch } from '@app/common/utils';

import { component } from '@app/common/ko';


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
    template: require('./index.html'),
    resources: {
        'en': {
            'fetch-data': 'Fetch data'
        },
        'vi': {
            'fetch-data': 'Tải dữ liệu'
        }
    }
})
export class FetchDataViewModel {
    public forecasts = ko.observableArray<IEmployee>();

    constructor() {
        fetch({
            method: 'get',
            url: '/json/employee.json'
        }).then((data: any) => {
            this.forecasts(data.response);
        }).catch((rej: any) => {
            console.log(rej);
        });
    }
}
