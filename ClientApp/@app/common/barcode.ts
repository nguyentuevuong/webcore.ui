import { _, ko } from '@app/providers';

export class BarCode {
    bars: Array<number> = [];
    handler: KnockoutObservable<string> = ko.observable('');

    dimensions: {
        [key: string]: number
    } = {
            height: 0,
            width: 0,
            start: 0,
            end: 0
        };

    elements: {
        video: HTMLVideoElement | null;
        canvas: HTMLCanvasElement | null;
        ctx: CanvasRenderingContext2D | null;
        canvasg: HTMLCanvasElement | null;
        ctxg: CanvasRenderingContext2D | null;
    } = {
            video: null,
            canvas: null,
            ctx: null,
            canvasg: null,
            ctxg: null
        };

    upc: { [key: string]: Array<number> } = {
        '0': [3, 2, 1, 1],
        '1': [2, 2, 2, 1],
        '2': [2, 1, 2, 2],
        '3': [1, 4, 1, 1],
        '4': [1, 1, 3, 2],
        '5': [1, 2, 3, 1],
        '6': [1, 1, 1, 4],
        '7': [1, 3, 1, 2],
        '8': [1, 2, 1, 3],
        '9': [3, 1, 1, 2]
    };

    check: { [key: string]: string } = {
        'oooooo': '0',
        'ooeoee': '1',
        'ooeeoe': '2',
        'ooeeeo': '3',
        'oeooee': '4',
        'oeeooe': '5',
        'oeeeoo': '6',
        'oeoeoe': '7',
        'oeoeeo': '8',
        'oeeoeo': '9'
    };

    config: {
        strokeColor: string;
        start: number;
        end: number;
        threshold: number;
        quality: number;
        delay: number;
    } = {
            strokeColor: '#f00',
            start: 0.1,
            end: 0.9,
            threshold: 160,
            quality: 0.45,
            delay: 100
        };

    constructor(params: {
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        canvasg: HTMLCanvasElement,
        subscribe: KnockoutObservable<string>
    }) {
        let self = this;

        self.elements.video = params.video;
        self.elements.canvas = params.canvas;
        self.elements.canvasg = params.canvasg;

        self.handler = params.subscribe;

        self.init();
    }

    init() {
        let self = this;

        window.URL = window.URL || _.has(window, 'webkitURL');
        navigator.getUserMedia = navigator.getUserMedia || _.has(navigator, 'webkitGetUserMedia') || _.has(navigator, 'mozGetUserMedia') || _.has(navigator, 'msGetUserMedia');

        self.elements.ctx = self.elements.canvas!.getContext('2d');
        self.elements.ctxg = self.elements.canvasg!.getContext('2d');

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                audio: false, video: {
                    advanced: [{
                        facingMode: "environment"
                    }]
                }
            }, function (stream) {
                self.elements.video!.src = window.URL.createObjectURL(stream);
            }, function (error) {
                console.log(error);
            });
        }

        self.elements.video!.addEventListener('canplay', function (evt: Event) {

            self.dimensions.height = self.elements.video!.videoHeight;
            self.dimensions.width = self.elements.video!.videoWidth;

            self.dimensions.start = self.dimensions.width * self.config.start;
            self.dimensions.end = self.dimensions.width * self.config.end;

            if (self.elements.canvas) {
                self.elements.canvas!.width = self.dimensions.width;
                self.elements.canvas!.height = self.dimensions.height;
            }

            if (self.elements.canvasg) {
                self.elements.canvasg!.width = self.dimensions.width;
                self.elements.canvasg!.height = self.dimensions.height;
            }

            self.drawGraphics();
            setInterval(function () { self.snapshot() }, self.config.delay);
        }, false);
    }

    snapshot() {
        let self = this;

        if (self.elements.video && self.elements.ctx) {
            self.elements.ctx.drawImage(self.elements.video, 0, 0, self.dimensions.width, self.dimensions.height);
        }

        self.processImage();
    }

    processImage() {
        let self = this,
            pixels = [],
            binary = [],
            pixelBars = [];

        self.bars = [];

        // convert to grayscale
        if (self.elements.ctx) {
            var imgd = self.elements.ctx.getImageData(self.dimensions.start, self.dimensions.height * 0.5, self.dimensions.end - self.dimensions.start, 1);

            var rgbpixels = imgd.data;

            for (var i = 0, ii = rgbpixels.length; i < ii; i = i + 4) {
                pixels.push(Math.round(rgbpixels[i] * 0.2126 + rgbpixels[i + 1] * 0.7152 + rgbpixels[i + 2] * 0.0722));
            }

            // normalize and convert to binary

            let min = Math.min.apply(null, pixels),
                max = Math.max.apply(null, pixels);

            for (var i = 0, ii = pixels.length; i < ii; i++) {
                if (Math.round((pixels[i] - min) / (max - min) * 255) > self.config.threshold) {
                    binary.push(1);
                } else {
                    binary.push(0);
                }
            }

            // determine bar widths

            let current = binary[0],
                count = 0;

            for (var i = 0, ii = binary.length; i < ii; i++) {
                if (binary[i] == current) {
                    count++;
                } else {
                    pixelBars.push(count);
                    count = 1;
                    current = binary[i]
                }
            }
            pixelBars.push(count);

            // quality check

            if (pixelBars.length < (3 + 24 + 5 + 24 + 3 + 1)) {
                return;
            }

            // find starting sequence

            let startIndex = 0,
                minFactor = 0.5,
                maxFactor = 1.5;

            for (var i = 3, ii = pixelBars.length; i < ii; i++) {
                var refLength = (pixelBars[i] + pixelBars[i - 1] + pixelBars[i - 2]) / 3;

                if ((pixelBars[i] > (minFactor * refLength) || pixelBars[i] < (maxFactor * refLength))
                    && (pixelBars[i - 1] > (minFactor * refLength) || pixelBars[i - 1] < (maxFactor * refLength))
                    && (pixelBars[i - 2] > (minFactor * refLength) || pixelBars[i - 2] < (maxFactor * refLength))
                    && (pixelBars[i - 3] > 3 * refLength)) {
                    startIndex = i - 2;
                    break;
                }
            }

            // return if no starting sequence found
            if (startIndex == 0) {
                return;
            }

            // discard leading and trailing patterns
            pixelBars = pixelBars.slice(startIndex, startIndex + 3 + 24 + 5 + 24 + 3);

            // calculate relative widths
            var ref = (pixelBars[0] + pixelBars[1] + pixelBars[2]) / 3;

            for (var i = 0, ii = pixelBars.length; i < ii; i++) {
                self.bars.push(Math.round(pixelBars[i] / ref * 100) / 100);
            }

            // analyze pattern
            self.analyze();
        }
    }

    analyze() {
        let self = this,
            // determine parity and reverse if necessary
            parities = [],
            // determine parity first digit and reverse sequence if necessary
            first = self.normalize(self.bars.slice(3, 3 + 4), 7);

        if (!(Math.round(first[1] + first[3]) % 2)) {
            self.bars = self.bars.reverse();
        }

        // split into digits
        let digits = [
            self.normalize(self.bars.slice(3, 3 + 4), 7),
            self.normalize(self.bars.slice(7, 7 + 4), 7),
            self.normalize(self.bars.slice(11, 11 + 4), 7),
            self.normalize(self.bars.slice(15, 15 + 4), 7),
            self.normalize(self.bars.slice(19, 19 + 4), 7),
            self.normalize(self.bars.slice(23, 23 + 4), 7),
            self.normalize(self.bars.slice(32, 32 + 4), 7),
            self.normalize(self.bars.slice(36, 36 + 4), 7),
            self.normalize(self.bars.slice(40, 40 + 4), 7),
            self.normalize(self.bars.slice(44, 44 + 4), 7),
            self.normalize(self.bars.slice(48, 48 + 4), 7),
            self.normalize(self.bars.slice(52, 52 + 4), 7)
        ];

        for (var i = 0; i < 6; i++) {
            if (self.parity(digits[i])) {
                parities.push('o');
            } else {
                parities.push('e');
                digits[i] = digits[i].reverse();
            }
        }

        // identify digits

        let result = [],
            quality = 0;

        for (var i = 0, ii = digits.length; i < ii; i++) {

            var distance = 9;
            var bestKey = '';

            for (let key in self.upc) {
                if (self.maxDistance(digits[i], self.upc[key]) < distance) {
                    distance = self.maxDistance(digits[i], self.upc[key]);
                    bestKey = key;
                }
            }

            result.push(bestKey);

            if (distance > quality) {
                quality = distance;
            }
        }

        // check digit
        var checkDigit = self.check[parities.join('')];

        if (quality < self.config.quality) {
            if (self.handler != null) {
                self.handler!(checkDigit + result.join(''));
            }
        }
    }

    normalize(input: Array<number>, total: number) {
        let sum = 0,
            result = [];

        for (let i = 0, ii = input.length; i < ii; i++) {
            sum = sum + input[i];
        }

        for (let i = 0, ii = input.length; i < ii; i++) {
            result.push(input[i] / sum * total);
        }

        return result;
    }

    maxDistance(a: Array<number>, b: Array<number>) {
        var distance = 0;

        for (var i = 0, ii = a.length; i < ii; i++) {
            if (Math.abs(a[i] - b[i]) > distance) {
                distance = Math.abs(a[i] - b[i]);
            }
        }

        return distance;
    }

    parity = (digit: Array<number>) => !!(Math.round(digit[1] + digit[3]) % 2);

    drawGraphics() {
        let self = this;

        if (self.elements.ctxg) {
            self.elements.ctxg!.strokeStyle = self.config.strokeColor;
            self.elements.ctxg!.lineWidth = 2;

            self.elements.ctxg!.beginPath();

            self.elements.ctxg!.moveTo(self.dimensions.start, self.dimensions.height * 0.5);
            self.elements.ctxg!.lineTo(self.dimensions.end, self.dimensions.height * 0.5);

            self.elements.ctxg!.stroke();
        }
    }

    // debugging utilities

    drawBars(binary: Array<number>) {
        let self = this;

        if (self.elements.ctxg) {
            for (var i = 0, ii = binary.length; i < ii; i++) {
                if (binary[i] == 1) {
                    self.elements.ctxg!.strokeStyle = '#fff';
                } else {
                    self.elements.ctxg!.strokeStyle = '#000';
                }

                self.elements.ctxg!.lineWidth = 3;
                self.elements.ctxg!.beginPath();

                self.elements.ctxg!.moveTo(self.dimensions.start + i, self.dimensions.height * 0.5);
                self.elements.ctxg!.lineTo(self.dimensions.start + i + 1, self.dimensions.height * 0.5);

                self.elements.ctxg!.stroke();
            }
        }
    }
}