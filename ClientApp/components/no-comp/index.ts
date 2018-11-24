import { ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    name: 'no-component',
    styles: require('./style.scss'),
    template: require('./index.html')
})
export class NoComponentViewModel {
    focusSearch: KnockoutObservable<boolean> = ko.observable(true);
}