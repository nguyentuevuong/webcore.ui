import * as _ from 'lodash';

export class Selectables {
    name: string = 'Selectables';

    on: boolean = false;
    zone: any = undefined;
    ipos: Array<any> = [];

    items: Array<HTMLElement> | undefined = undefined;

    options: any = {
        zone: "#wrapper", // ID of the element whith selectables.        
        elements: "a", //  items to be selectable .list-group, #id > .class,'htmlelement' - valid querySelectorAll        
        selectedClass: 'active', // class name to apply to seleted items      
        key: false, //'altKey,ctrlKey,metaKey,false  // activate using optional key     
        moreUsing: 'shiftKey', //altKey,ctrlKey,metaKey   // add more to selection
        enabled: true, //false to .enable() at later time       
        start: null, //  event on selection start
        stop: null, // event on selection end
        onClick: null, // event fired on every item when selected.        
        onSelect: null, // event fired on every item when selected.               
        onDeselect: null         // event fired on every item when selected.
    }

    constructor(opts: any) {
        let self = this;

        _.extend(self.options, opts || {});
        _.extend(self.options, { selectables: self });

        self.enable();
    }

    isClick = () => {
        let self = this;

        return self.ipos ? _.size(self.ipos) == 2 || (self.ipos[0] == self.ipos[2] && self.ipos[1] == self.ipos[3]) : true;
    }

    suspend = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return true;
    };

    enable = () => {
        let self = this;

        if (self.on) {
            throw new Error(self.name + " :: is alredy enabled");
        }

        self.zone = _.isString(self.options.zone) ? document.querySelector(self.options.zone) : self.options.zone;

        if (!self.zone) {
            throw new Error(self.name + " :: no zone defined in options. Please use element with ID");
        }

        _.defer(() => {
            self.items = _.map(_.isString(self.options.zone) ?
                document.querySelectorAll(`${self.options.zone} ${self.options.elements}`) :
                (self.options.zone as HTMLElement).querySelectorAll(self.options.elements), m => m);
        });

        self.disable();

        self.zone.addEventListener('mousedown', self.rectOpen);

        self.on = true;

        return self;
    };

    disable = () => {
        let self = this;

        self.zone.removeEventListener('mousedown', self.rectOpen);

        self.on = false;

        return self;
    };

    rectOpen = (e: any) => {
        let self = this;

        self.options.start && self.options.start(e);

        if (self.options.key && !e[self.options.key]) {
            return;
        }

        document.body.classList.add('nts-noselect');

        _.each(self.items, (el: HTMLElement) => {
            //el.addEventListener('click', self.suspend, true);
            if (!e[self.options.moreUsing] && el) {
                el.classList.remove(self.options.selectedClass);
            }
        });

        self.ipos = [e.pageX, e.pageY];

        if (!document.getElementById('nts-select-box')) {
            let gh = document.createElement('div');
            {
                gh.id = 'nts-select-box';
                gh.style.left = e.pageX + 'px';
                gh.style.top = e.pageY + 'px';
                gh.style.borderWidth = '0px';
            }
            document.body.appendChild(gh);
        }

        document.body.addEventListener('mousemove', self.rectDraw);
        window.addEventListener('mouseup', self.select);

        return true;
    };

    rectDraw = (e: MouseEvent) => {
        let self = this,
            g: HTMLElement | null = document.getElementById('nts-select-box');

        if (!self.ipos || g === null) {
            return;
        }

        let tmp,
            x1 = self.ipos[0],
            y1 = self.ipos[1],
            x2 = e.pageX,
            y2 = e.pageY;

        if (x1 != x2 || y1 != y2) {
            self.ipos = _.concat([self.ipos[0], self.ipos[1]], [x2, y2]);
        } else {
            self.ipos = [self.ipos[0], self.ipos[1]];
        }

        if (x1 > x2) {
            tmp = x2, x2 = x1, x1 = tmp;
        }

        if (y1 > y2) {
            tmp = y2, y2 = y1, y1 = tmp;
        }

        if (g) {
            g.style.left = x1 + 'px';
            g.style.top = y1 + 'px';
            g.style.width = (x2 - x1) + 'px';
            g.style.height = (y2 - y1) + 'px';

            if (x2 - x1 > 0 || y2 - y1 > 0) {
                g.style.borderWidth = '1px';
            }
        }

        return true;
    };

    select = (e: any) => {
        let self = this,
            offset = function (el: HTMLElement | null) {
                if (el) {
                    var r = el.getBoundingClientRect();
                    return {
                        top: r.top + document.body.scrollTop,
                        left: r.left + document.body.scrollLeft
                    };
                } else {
                    return {
                        top: -1,
                        left: -1
                    }
                }
            },
            cross = function (a: HTMLElement | null, b: HTMLElement | null) {
                if (a && b) {
                    var offsetA = offset(a),
                        offsetB = offset(b),
                        aTop = offsetA.top,
                        aLeft = offsetA.left,
                        bTop = offsetB.top,
                        bLeft = offsetB.left;

                    return !(((aTop + a.offsetHeight) < (bTop)) || (aTop > (bTop + b.offsetHeight)) || ((aLeft + a.offsetWidth) < bLeft) || (aLeft > (bLeft + b.offsetWidth)));
                } else {
                    return false;
                }
            },
            a: HTMLElement | null = document.getElementById('nts-select-box');

        if (a) {
            document.body.classList.remove('nts-noselect');
            document.body.removeEventListener('mousemove', self.rectDraw);

            window.removeEventListener('mouseup', self.select);

            let sclass = self.options.selectedClass,
                selecteds: Array<HTMLElement> = _.filter(self.items, (el: HTMLElement) => cross(a, el)),
                deselecteds: Array<HTMLElement> = _.filter(self.items, (el: HTMLElement) => !cross(a, el));


            _.each(self.items, (el: HTMLElement) => {
                if (cross(a, el)) {
                    el.classList.add(sclass);
                } else {
                    el.classList.remove(sclass);
                }

                setTimeout(function () {
                    el.removeEventListener('click', self.suspend, true);
                }, 100);
            });

            if (_.size(selecteds)) {
                if (_.size(selecteds) == 1 || self.isClick()) {
                    self.options.onClick && self.options.onClick(selecteds[0]);
                } else {
                    self.options.onSelect && self.options.onSelect(selecteds);
                }
            }

            if (_.size(deselecteds) && !self.isClick()) {
                self.options.onDeselect && self.options.onDeselect(deselecteds);
            }

            a!.parentNode!.removeChild(a);

            delete (self.ipos);

            self.options.stop && self.options.stop(e);
        }

        return true;
    }
}