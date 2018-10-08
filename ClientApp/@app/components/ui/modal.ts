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

        ko.utils.registerEventHandler(element, "dialog.opening", (evt: Event) => {

        });

        ko.utils.triggerEvent(element, "dialog.opening")

        self.element.addEventListener("dialog.opening", (evt: Event) => {
            let data = (<CustomEvent>evt).detail;
            console.log(data);
        });

        // dispatch opening event
        self.element.dispatchEvent(new CustomEvent('dialog.opening', {
            detail: {
                id: 1,
                name: 'xxx'
            }
        }));
    }

    afterRender(): void {
        let self = this;

        // dispatch opened event
        self.element.dispatchEvent(new CustomEvent('dialog.opened'));
    }

    dispose(): void {
        let self = this;

        // dispatch closed event
        self.element.dispatchEvent(new CustomEvent('dialog.closed'));
    }
}