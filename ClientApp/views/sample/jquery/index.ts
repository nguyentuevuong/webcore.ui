import { component } from '@app/common';
import * as ko from 'knockout';
import * as $ from 'jquery';
import * as _ from 'lodash';

@component({
    url: 'sample/jquery',
    title: 'Demo jquery',
    icon: 'fa fa-globe',
    template: require('./index.html')
})
export class SampleJqueryViewModel {

    constructor(params: any, private element: HTMLElement) {
        let self = this,
            $element = $(self.element);

        $element.find('#selector').addClass('abc').text('Hello world!');
    }
}