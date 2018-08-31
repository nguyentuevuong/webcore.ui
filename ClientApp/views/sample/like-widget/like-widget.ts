import { component } from '@app/common';
import * as ko from 'knockout';

@component({
    url: 'sample/like-widget',
    name: 'like-widget',
    title: 'Like widget',
    icon: 'fa fa-thumbs-o-up',
    template: `
    <div data-bind="visible: !chosenValue()">
        <button class="btn btn-primary" data-bind="click: like">Like it</button>
        <button class="btn btn-secondary" data-bind="click: dislike">Dislike it</button>
    </div>
    <div data-bind="visible: chosenValue">
        You <strong data-bind="text: chosenValue"></strong> it
    </div>`
})
export class SampleDeferredViewModel {
    chosenValue: KnockoutObservable<string | undefined> = ko.observable();

    constructor(params: any) {

    }

    like = () => {
        this.chosenValue('like')
    }

    dislike = () => {
        this.chosenValue('dislike')
    }
}