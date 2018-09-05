import * as ko from 'knockout';
import { component } from '@app/common/ko';

@component({
    name: 'no-component',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class NoComponentViewModel {
    focusSearch: KnockoutObservable<boolean> = ko.observable(true); 
}