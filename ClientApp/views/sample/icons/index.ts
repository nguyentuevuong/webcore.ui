import { component } from "@app/common/ko";

import * as data from './data';
import * as ko from 'knockout';
import * as _ from 'lodash';

@component({
    url: '/sample/icons',
    icon: 'fa fa-address-book-o',
    title: 'Font icons',
    template: require('./index.html'),
    styles: `.icon {
        padding-top: 5px;
        padding-bottom: 5px;
        overflow: hidden;
    }
    
    .icon:hover {
        background-color: #ccc;
    }
    
    i, span {
        display: inline-block;
    }
    
    i ~ span {
        padding-left: 15px;
        white-space: nowrap;
        max-width: calc(100% - 20px);
        text-overflow: ellipsis;
    }`
})
export class IconsViewModel {
    public keyword: KnockoutObservable<string> = ko.observable('');

    public filtered: KnockoutObservableArray<string> = ko.observableArray([]).extend({ deferred: true });

    constructor() {
        this.keyword.subscribe(k => {
            let _data: Array<string> = _(data.icons).groupBy(g => g).map(m => m[0]).value();

            this.filtered(_(_data || []).filter(f => f.indexOf(k) > -1).value());
        });
        this.keyword('fa');
    }
}