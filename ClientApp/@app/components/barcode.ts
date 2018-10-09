import { _, ko } from '@app/providers';
import { component, IView } from "@app/common/ko";
import { BarCode } from '@app/common/barcode';
import { random, randomId } from '@app/common/id';

import { BrowserQRCodeReader, Result } from '@zxing/library';

@component({
    name: 'barcode',
    styles: `#barcode{position:relative},
    #barcode>video,#barcode>canvas{width:200px;height:200px}	
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
            video: random.id,
            canvas: random.id,
            canvasg: random.id
        });

        if (params.control) {
            self.control = params.control;
        }
    }

    afterRender(): void {

        let self = this,
            video = document.getElementById(self.ids.video) as HTMLVideoElement,
            codeReader = new BrowserQRCodeReader(),
            continuos = () => {
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                        audio: false, video: {
                            advanced: [{
                                facingMode: "environment"
                            }]
                        }
                    }, function (stream) {
                        codeReader.decodeFromVideoSource(window.URL.createObjectURL(stream), video)
                            .then((result: Result) => {
                                self.control(result.getText());
                                continuos();
                            })
                            .catch(err => console.error(err));
                    }, function (error) {
                        console.log(error);
                    });
                }
            };

        continuos();
    }
}