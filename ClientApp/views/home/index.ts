import { $, ko } from '@app/providers';
import { md } from '@app/common/utils';

import { component, IView, IDispose } from '@app/common/ko';

@component({
    url: '/',
    icon: 'fa fa-home',
    title: '#home',
    styles: require('./style.scss'),
    template: require('./index.html'),
    resources: require('./resources.json')
})
export class HomeViewModel implements IView, IDispose {
    status: KnockoutObservable<string | undefined> = ko.observable('pending');
    listEmployee: KnockoutObservableArray<any> = ko.observableArray([]);

    constructor(params: any, private element: HTMLElement) {
        $.getJSON('/json/employee.json', {}, this.listEmployee);
    }

    dispose(): void {
        console.log("Home view disposed!");
    }

    afterRender(): void {
        console.log("Home view renderred!");

        let self = this,
            textarea = self.element.querySelector('textarea'),
            mdpreview = self.element.querySelector('#html_preview');

        ko.utils.registerEventHandler(textarea, 'keyup', () => {
            if (textarea && mdpreview) {
                ko.utils.setHtml(mdpreview, md.parse(textarea.value));
            }
        });

        ko.utils.triggerEvent(textarea, 'keyup');
    }
}