import { ko } from '@app/providers';


let _w = window,
    _b = document.body,
    _d = document.documentElement,
    extend = ko.utils.extend,
    domData = ko.utils.domData,
    registerEvent = ko.utils.registerEventHandler,
    // update item position 
    translate3d = (item: HTMLElement, x: number, y: number, z: number = 0) => item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`,
    // checks if mouse x/y is on top of an item 
    isOnTop = (item: HTMLElement, x: number, y: number) => {
        let box = item.getBoundingClientRect(),
            isx = (x > box.left && x < (box.left + box.width)),
            isy = (y > box.top && y < (box.top + box.height));

        return (isx && isy);
    },
    // manipulate the className of an item (for browsers that lack classList support)
    itemClass = (item: HTMLElement, task: ITEMCLASS, className: string) => {
        let _cls = item.className,
            list = _cls.split(/\s+/),
            index = list.indexOf(className);

        switch (task) {
            case ITEMCLASS.ADD:
                if (index == -1) {
                    list.push(className);
                    item.className = list.join(" ");
                }
                break;
            case ITEMCLASS.REMOVE:
                if (index != -1) {
                    list.splice(index, 1);
                    item.className = list.join(" ");
                }
                break;
        }
    },
    // get position of mouse/touch in relation to viewport 
    getPoint: (e: MouseEvent) => { x: number; y: number; } = (e: MouseEvent) => {
        let scrollX = Math.max(0, _w.pageXOffset || (_d ? _d.scrollLeft : 0) || _b.scrollLeft || 0) - ((_d ? _d.clientLeft : 0) || 0),
            scrollY = Math.max(0, _w.pageYOffset || (_d ? _d.scrollTop : 0) || _b.scrollTop || 0) - ((_d ? _d.clientTop : 0) || 0),
            pointX = e ? (Math.max(0, e.pageX || e.clientX || 0) - scrollX) : 0,
            pointY = e ? (Math.max(0, e.pageY || e.clientY || 0) - scrollY) : 0;

        return { x: pointX, y: pointY };
    };

// class constructor
export class Sortable {
    private dragging: boolean = false;

    private clickIndex: number = 0;
    private targetIndex: number = 0;

    private clickItem: HTMLElement = document.createElement('span');
    private placeHolderItem: HTMLElement = document.createElement('span');

    private options: {
        connectWith: Array<HTMLElement> | string;
        onSelect?: (evt: MouseEvent, data: ISortableData) => void,
        onDrag?: (evt: MouseEvent, data: ISortableData) => void,
        onDrop?: (evt: MouseEvent, data: ISortableData) => void
        [key: string]: any;
    } = {
            connectWith: '[data-sortable]'
        };

    private dragcontainer: HTMLElement = document.createElement('div');
    private targetContainer: HTMLElement = document.createElement('div');
    private lstContainers: NodeListOf<Element> | Array<Element> = [];

    private clickPoint: { x: number; y: number; } = { x: 0, y: 0 };

    constructor(container: HTMLElement | null, options?: any) {
        let self = this;

        if (container && container instanceof Element) {
            // set container
            self.dragcontainer = container;

            extend(self.options, options || {});

            // self.container.style.position = "static";
            itemClass(self.dragcontainer, ITEMCLASS.ADD, 'sortable');
            self.dragcontainer.setAttribute("data-sortable", 'true');

            // start drag
            registerEvent(window, "mousedown", self.onSelect.bind(self));
            registerEvent(window, "touchstart", self.onSelect.bind(self));

            // on dragging
            registerEvent(window, "mousemove", self.onDrag.bind(self));
            registerEvent(window, "touchmove", self.onDrag.bind(self));

            // finish drag
            registerEvent(window, "mouseup", self.onDrop.bind(self));
            registerEvent(window, "touchend", self.onDrop.bind(self));
        }
    }

    // on item press/drag 
    private onSelect(evt: MouseEvent) {
        let self = this,
            options = self.options,
            target = evt.target as HTMLElement;

        if (self.dragcontainer == target.parentNode) {
            evt.preventDefault();

            if (options.onSelect) {
                options.onSelect.apply(null, [evt, {
                    sourceIndex: (self.clickIndex = [].slice.call(self.dragcontainer.children).indexOf(target)),
                    sourceParentNode: self.dragcontainer
                }]);
            }

            if (!evt.cancelBubble) {
                self.dragging = true;
                self.clickPoint = getPoint(evt);

                self.makeDragItem(target);

                self.swapItems(self.placeHolderItem, self.clickItem);

                itemClass(self.dragcontainer, ITEMCLASS.ADD, 'sortable-dragging');

                if (options.connectWith) {
                    if (typeof options.connectWith !== 'string') {
                        self.lstContainers = options.connectWith;
                    }
                    else {
                        self.lstContainers = document.querySelectorAll(options.connectWith);
                    }
                }
            }
        }
    }

    // on item release/drop 
    private onDrop(evt: MouseEvent) {
        let self = this,
            options = self.options;

        self.dragging = false;

        if (options.onDrop) {
            options.onDrop.apply(null, [evt, {
                sourceIndex: self.clickIndex,
                sourceParentNode: self.dragcontainer,
                targetParentNode: self.placeHolderItem.parentElement,
                targetIndex: self.targetIndex,
                cancelDrop: false
            }]);
        }

        self.swapItems(self.placeHolderItem, self.clickItem, SWAP.LEFT);

        self.clear();
    }

    // on item drag/move
    private onDrag(evt: MouseEvent) {
        let self = this,
            options = self.options,
            dropPoint = getPoint(evt),
            clickPoint = self.clickPoint;

        self.targetContainer = self.dragcontainer;

        if (self.dragging) {
            evt.preventDefault();

            // change position of clickItem
            translate3d(self.clickItem, (dropPoint.x - clickPoint.x), (dropPoint.y - clickPoint.y));

            // keep an eye for other sortable lists and switch over to it on hover
            [].slice.call(self.lstContainers).forEach((sub: HTMLElement) => {
                if (isOnTop(sub, dropPoint.x, dropPoint.y)) {
                    self.targetContainer = sub;
                }
            });

            // container is empty, move clicked item over to it on hover 
            if (isOnTop(self.targetContainer, dropPoint.x, dropPoint.y) && self.targetContainer.children.length === 0) {
                self.targetContainer.appendChild(self.placeHolderItem);

                self.targetIndex = [].slice.call(self.targetContainer.children)
                    .filter((e: HTMLElement) => e != self.clickItem)
                    .indexOf(self.placeHolderItem);

                setTimeout(() => {
                    // check if current drag item is over another item and swap places
                    [].slice.call(self.targetContainer.children).forEach((subItem: HTMLElement) => {
                        if (subItem !== self.clickItem && subItem !== self.placeHolderItem) {
                            if (isOnTop(subItem, dropPoint.x, dropPoint.y)) {
                                if (options.onDrag) {
                                    options.onDrag.apply(null, [evt, {
                                        sourceIndex: self.clickIndex,
                                        sourceParentNode: self.dragcontainer,
                                        targetIndex: self.targetIndex,
                                        targetParentNode: self.targetContainer,
                                        cancelDrop: true
                                    }]);
                                }
                            }
                        }
                    });
                }, 10);
            } else {
                // check if current drag item is over another item and swap places
                [].slice.call(self.targetContainer.children).forEach((subItem: HTMLElement) => {
                    if (subItem !== self.clickItem && subItem !== self.placeHolderItem) {
                        if (isOnTop(subItem, dropPoint.x, dropPoint.y)) {
                            self.swapItems(self.placeHolderItem, subItem);

                            self.targetIndex = [].slice.call(self.targetContainer.children)
                                .filter((e: HTMLElement) => e != self.clickItem)
                                .indexOf(self.placeHolderItem);

                            if (options.onDrag) {
                                options.onDrag.apply(null, [evt, {
                                    sourceIndex: self.clickIndex,
                                    sourceParentNode: self.dragcontainer,
                                    targetIndex: self.targetIndex,
                                    targetParentNode: self.targetContainer,
                                    cancelDrop: true
                                }]);
                            }
                        }
                    }
                });
            }
        }
    }

    // swap position of two item in sortable list container 
    private swapItems(item1: HTMLElement, item2: HTMLElement, swap: SWAP = SWAP.RIGHT) {
        let parent1: Node | null = item1.parentNode,
            parent2: Node | null = item2.parentNode;

        if (parent1 && parent2) {
            if (parent1 !== parent2) {
                // move to new list
                if (swap == SWAP.LEFT) {
                    parent1.insertBefore(item2, item1);
                } else {
                    parent2.insertBefore(item1, item2);
                }
            }
            else {
                // sort is same list 
                let temp = item1.cloneNode();

                parent1.insertBefore(temp, item1);
                parent2.insertBefore(item1, item2);
                parent1.insertBefore(item2, temp);

                parent1.removeChild(temp);
            }
        }
    }

    // make a temp fake item for dragging and add to container 
    private makeDragItem = (item: HTMLElement) => {
        let self = this;

        self.clickItem = item;

        self.placeHolderItem = item.cloneNode(true) as HTMLElement;

        self.placeHolderItem.removeAttribute('id');
        self.placeHolderItem.removeAttribute('data-bind');

        itemClass(self.placeHolderItem, ITEMCLASS.ADD, 'active');

        self.clickItem.style.top = (item.offsetTop || 0) + "px";
        self.clickItem.style.left = (item.offsetLeft || 0) + "px";
        self.clickItem.style.width = (item.offsetWidth || 0) + "px";

        self.clickItem.style.zIndex = "999";
        self.clickItem.style.position = "absolute";

        self.dragcontainer.insertBefore(self.placeHolderItem, self.clickItem);
    }

    // remove drag item that was added to container 
    private clear = () => {
        let self = this,
            parent = self.placeHolderItem.parentNode;

        self.clickItem.removeAttribute('style');

        if (parent) {
            parent.removeChild(self.placeHolderItem);
        }

        self.lstContainers = [];

        self.clickItem = document.createElement('span');
        self.placeHolderItem = document.createElement('span');

        self.clickIndex = 0;
        self.targetIndex = 0;
        
        self.targetContainer = document.createElement('div');

        itemClass(self.dragcontainer, ITEMCLASS.REMOVE, 'sortable-dragging');
    }
}

enum SWAP {
    LEFT = <any>'left',
    RIGHT = <any>'right'
}

enum ITEMCLASS {
    ADD = <any>'add',
    REMOVE = <any>'remove'
}

interface ISortableData {
    sourceParentNode: HTMLElement;
    sourceIndex: number;
    targetParentNode: HTMLElement,
    targetIndex: number;
    cancelDrop: boolean;
}