import { _, ko } from '@app/providers';
import { component, IView } from "@app/common/ko";
import { BarCode } from '@app/common/barcode';
import { randomId } from '@app/common/id';

@component({
    name: 'barcode',
    styles: `#barcode{position:relative},
    #barcode>video,#barcode>canvas{height: 100px}	
    #barcode>canvas{position:absolute;top:0px;left:0px}
    #barcode+canvas{display:none}`,
    template: `
    <div id="barcode">
        <video data-bind="attr: { id: $vm.ids.video }" autoplay></video>
        <canvas data-bind="attr: { id: $vm.ids.canvasg }"></canvas>
    </div>
    <canvas data-bind="attr: { id: $vm.ids.canvas }"></canvas>
    `
})
export class InputComponent implements IView {
    control: KnockoutObservable<string> = ko.observable('');
    ids: {
        video: string;
        canvas: string;
        canvasg: string;
    } = {
            video: '',
            canvas: '',
            canvasg: ''
        };

    constructor(params: { control: ValidationObservable<any> }, private element: HTMLElement) {
        let self = this;

        ko.utils.extend(self.ids, {
            video: randomId(),
            canvas: randomId(),
            canvasg: randomId()
        });

        if (params.control) {
            self.control = params.control;
        }
    }

    afterRender(): void {

        let self = this,
            video = document.getElementById(self.ids.video) as HTMLVideoElement,
            canvas = document.getElementById(self.ids.canvas) as HTMLCanvasElement,
            canvasg = document.getElementById(self.ids.canvasg) as HTMLCanvasElement;

        if (video && canvas && canvasg) {
            new BarCode({
                canvas: canvas,
                canvasg: canvasg,
                subscribe: self.control,
                video: video
            });
        }
        debugger;
    }
}