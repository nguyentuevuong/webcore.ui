import { _, ko } from '@app/providers';
import { component, IView, IDispose } from "@app/common/ko";

@component({
    name: 'modal',
    template: ``
})
export class ModalComponent implements IView, IDispose {
    control: KnockoutObservable<string> = ko.observable('')
        .extend({
            $name: '#noname',
            $constraint: '#noconstraint'
        });

    constructor(params: any, private element: HTMLElement) {
        let self = this;

        if (params.control) {
            self.control = params.control;
        }

        // remove attr role (no need display)
        element.removeAttribute('role');
    }

    afterRender(): void {

    }

    dispose(): void {
        let self = this;

        self.element.dispatchEvent(new Event('dialog.close'));
    }
}