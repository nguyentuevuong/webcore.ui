import * as ko from 'knockout';

import { component } from 'common';

@component({
    url: 'sample/class-toggle',
    title: 'Class css',
    icon: 'fa fa-css3',
    template: require('./index.html')
})
class SampleClassViewModel {
    style: KnockoutObservable<string>  = ko.observable('alert-warning');
}