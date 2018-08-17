import { component } from '../../decorator/component';
import * as ko from 'knockout';

@component({
    name: 'no-component',
    styles: require('./no-comp.css'),
    template: require('./no-comp.html')
})
export class NoComponentViewModel {
    focusSearch: KnockoutObservable<boolean> = ko.observable(true); 
}