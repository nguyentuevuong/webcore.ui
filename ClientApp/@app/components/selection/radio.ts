import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'radio',
    template: ``
})
export class RadioComponent {
    control: KnockoutObservableSelection = ko.observableSelection('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: { control: KnockoutObservableSelection }, element: HTMLElement) {
        let self = this;

        if (params.control) {
            self.control = params.control;
        }
    }
}