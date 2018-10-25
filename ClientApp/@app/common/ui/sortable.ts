let _w = window,
    _b = document.body,
    _d = document.documentElement,
    // get position of mouse/touch in relation to viewport 
    getPoint: (e: MouseEvent) => {
        x: number;
        y: number;
    } = (e: MouseEvent) => {
        let scrollX = Math.max(0, _w.pageXOffset || (_d ? _d.scrollLeft : 0) || _b.scrollLeft || 0) - ((_d ? _d.clientLeft : 0) || 0),
            scrollY = Math.max(0, _w.pageYOffset || (_d ? _d.scrollTop : 0) || _b.scrollTop || 0) - ((_d ? _d.clientTop : 0) || 0),
            pointX = e ? (Math.max(0, e.pageX || e.clientX || 0) - scrollX) : 0,
            pointY = e ? (Math.max(0, e.pageY || e.clientY || 0) - scrollY) : 0;

        return { x: pointX, y: pointY };
    };

// class constructor
export class Sortable {
    dragging: boolean = false;

    hovItem: HTMLElement | null = null;
    dragItem: HTMLElement | null = null;
    clickItem: HTMLElement | null = null;

    options: { [key: string]: any } = {};

    container: HTMLElement = document.createElement('div');
    lstContainers: NodeListOf<Element> | Array<Element> = [];

    clickPoint: { x: number; y: number; } = { x: 0, y: 0 };

    constructor(container: HTMLElement | null, options?: any) {
        let self = this;

        if (container && container instanceof Element) {
            self.container = container;

            self.options = options || {};

            //self.container.style.position = "static";
            self.container.setAttribute("data-sortable", 'true');

            window.addEventListener("mousedown", self.onPress.bind(self));
            window.addEventListener("touchstart", self.onPress.bind(self));

            window.addEventListener("mouseup", self.onRelease.bind(self));
            window.addEventListener("touchend", self.onRelease.bind(self));

            window.addEventListener("mousemove", self.onMove.bind(self));
            window.addEventListener("touchmove", self.onMove.bind(self));
        }
    }

    // checks if mouse x/y is on top of an item 
    private isOnTop(item: HTMLElement, x: number, y: number) {
        let box = item.getBoundingClientRect(),
            isx = (x > box.left && x < (box.left + box.width)),
            isy = (y > box.top && y < (box.top + box.height));

        return (isx && isy);
    }

    // manipulate the className of an item (for browsers that lack classList support)
    private itemClass(item: HTMLElement, task: string, cls: string) {
        var list = item.className.split(/\s+/),
            index = list.indexOf(cls);

        if (task === "add" && index == -1) {
            list.push(cls);
            item.className = list.join(" ");
        }
        else if (task === "remove" && index != -1) {
            list.splice(index, 1);
            item.className = list.join(" ");
        }
    }

    // swap position of two item in sortable list container 
    private swapItems(item1: HTMLElement, item2: HTMLElement) {
        let parent1: Node | null = item1.parentNode,
            parent2: Node | null = item2.parentNode;

        if (parent1 && parent2) {
            if (parent1 !== parent2) {
                // move to new list 
                parent2.insertBefore(item1, item2);
            }
            else {
                // sort is same list 
                let temp = document.createElement("div");

                parent1.insertBefore(temp, item1);
                parent2.insertBefore(item1, item2);
                parent1.insertBefore(item2, temp);

                parent1.removeChild(temp);
            }
        }
    }

    // update item position 
    private moveItem = (item: HTMLElement, x: number, y: number) => item.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // make a temp fake item for dragging and add to container 
    private makeDragItem(item: HTMLElement) {
        let self = this;

        //self.trashDragItem();

        self.clickItem = item;
        self.dragItem = item.cloneNode(true) as HTMLElement;

        self.lstContainers = document.querySelectorAll("[data-sortable]");

        self.itemClass(self.clickItem, "add", "active");
        self.itemClass(self.dragItem, 'add', 'dragging');

        self.dragItem.style.zIndex = "999";
        self.dragItem.style.position = "absolute";

        self.dragItem.style.top = (item.offsetTop || 0) + "px";
        self.dragItem.style.left = (item.offsetLeft || 0) + "px";
        self.dragItem.style.width = (item.offsetWidth || 0) + "px";

        self.container.appendChild(self.dragItem);
    }

    // remove drag item that was added to container 
    private trashDragItem() {
        let self = this;

        if (self.dragItem && self.clickItem) {
            self.container.removeChild(self.dragItem);
            
            self.itemClass(self.clickItem, "remove", "active");

            self.dragItem = null;
            self.clickItem = null;
        }
    }

    // on item press/drag 
    private onPress(evt: MouseEvent) {
        let self = this,
            target = evt.target as HTMLElement;

        if (self.container == target.parentNode) {
            evt.preventDefault();

            self.dragging = true;
            self.clickPoint = getPoint(evt);

            self.makeDragItem(target);
        }
    }

    // on item release/drop 
    private onRelease(e: MouseEvent) {
        let self = this;

        self.dragging = false;

        self.trashDragItem();
    }

    // on item drag/move
    private onMove(e: MouseEvent) {
        let self = this,
            dropPoint = getPoint(e),
            container = self.container,
            clickPoint = self.clickPoint;

        if (self.dragItem && self.dragging) {
            e.preventDefault();

            // drag fake item 
            self.moveItem(self.dragItem, (dropPoint.x - clickPoint.x), (dropPoint.y - clickPoint.y));

            // keep an eye for other sortable lists and switch over to it on hover
            [].slice.call(self.lstContainers).forEach((sub: HTMLElement) => {
                if (self.isOnTop(sub, dropPoint.x, dropPoint.y)) {
                    container = sub;
                }
            });

            // container is empty, move clicked item over to it on hover 
            if (self.isOnTop(container, dropPoint.x, dropPoint.y) && container.children.length === 0) {
                if (self.clickItem) {
                    container.appendChild(self.clickItem);
                }

                return;
            }

            // check if current drag item is over another item and swap places
            [].slice.call(container.children).forEach((subItem: HTMLElement) => {
                if (subItem !== self.clickItem && subItem !== self.dragItem) {
                    if (self.isOnTop(subItem, dropPoint.x, dropPoint.y)) {
                        self.hovItem = subItem;

                        if (self.clickItem) {
                            self.swapItems(self.clickItem, self.hovItem);
                        }
                    }
                }
            });
        }
    }
}