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

    sortLists: NodeListOf<Element> | Array<any> = [];
    container: HTMLElement = document.createElement('div');

    options: { [key: string]: any } = {};

    hovItem: HTMLElement | null = null;
    dragItem: HTMLElement | null = null;

    dragging: boolean = false;
    clickItem: HTMLElement | null = null;

    click: { x: number; y: number; } = { x: 0, y: 0 };

    constructor(container: HTMLElement | null, options?: any) {
        let self = this;
        if (container && container instanceof Element) {
            self.container = container;
            self.options = options || {}; /* nothing atm */

            self.clickItem = null;
            self.dragItem = null;
            self.hovItem = null;
            self.sortLists = [];
            self.click = { x: 0, y: 0 };
            self.dragging = false;

            self.container.setAttribute("data-is-sortable", '1');
            self.container.style["position"] = "static";

            window.addEventListener("mousedown", self.onPress.bind(self), true);
            window.addEventListener("touchstart", self.onPress.bind(self), true);

            window.addEventListener("mouseup", self.onRelease.bind(self), true);
            window.addEventListener("touchend", self.onRelease.bind(self), true);

            window.addEventListener("mousemove", self.onMove.bind(self), true);
            window.addEventListener("touchmove", self.onMove.bind(self), true);
        }
    }

    // serialize order into array list 
    toArray(attr: string) {
        attr = attr || "id";

        var data = [],
            item = null,
            uniq = "";

        for (var i = 0; i < this.container.children.length; ++i) {
            let item = this.container.children[i],
                uniq = item.getAttribute(attr) || "";

            uniq = uniq.replace(/[^0-9]+/gi, "");

            data.push(uniq);
        }

        return data;
    }

    // serialize order array into a string 
    public toString(attr: string, delimiter: string) {
        return this.toArray(attr).join(delimiter || ":");
    }

    // checks if mouse x/y is on top of an item 
    isOnTop(item: HTMLElement, x: number, y: number) {
        var box = item.getBoundingClientRect(),
            isx = (x > box.left && x < (box.left + box.width)),
            isy = (y > box.top && y < (box.top + box.height));

        return (isx && isy);
    }

    // manipulate the className of an item (for browsers that lack classList support)
    itemClass(item: HTMLElement, task: string, cls: string) {
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
        let parent1 = item1.parentNode,
            parent2 = item2.parentNode;

        if (parent1 && parent2) {
            if (parent1 !== parent2) {
                // move to new list 
                parent2.insertBefore(item1, item2);
            }
            else {
                // sort is same list 
                var temp = document.createElement("div");
                parent1.insertBefore(temp, item1);
                parent2.insertBefore(item1, item2);
                parent1.insertBefore(item2, temp);
                parent1.removeChild(temp);
            }
        }
    }

    // update item position 
    moveItem(item: HTMLElement, x: number, y: number) {
        //item.style["-webkit-transform"] = "translateX( " + x + "px ) translateY( " + y + "px )";
        //item.style["-moz-transform"] = "translateX( " + x + "px ) translateY( " + y + "px )";
        //item.style["-ms-transform"] = "translateX( " + x + "px ) translateY( " + y + "px )";
        item.style["transform"] = "translateX( " + x + "px ) translateY( " + y + "px )";
    }

    // make a temp fake item for dragging and add to container 
    makeDragItem(item: HTMLElement) {
        let self = this;

        self.trashDragItem();
        self.sortLists = document.querySelectorAll("[data-is-sortable]");

        self.clickItem = item;
        self.itemClass(self.clickItem, "add", "active");

        self.dragItem = document.createElement(item.tagName);
        self.dragItem.className = "dragging";
        self.dragItem.innerHTML = item.innerHTML;

        self.dragItem.style.position = "absolute";
        self.dragItem.style.zIndex = "999";
        self.dragItem.style.left = (item.offsetLeft || 0) + "px";
        self.dragItem.style.top = (item.offsetTop || 0) + "px";
        self.dragItem.style.width = (item.offsetWidth || 0) + "px";

        self.container.appendChild(this.dragItem as Node);
    }

    // remove drag item that was added to container 
    trashDragItem() {
        if (this.dragItem && this.clickItem) {
            this.itemClass(this.clickItem, "remove", "active");
            this.clickItem = null;

            this.container.removeChild(this.dragItem);
            this.dragItem = null;
        }
    }

    // on item press/drag 
    onPress(evt: MouseEvent) {
        if (evt) {
            let self = this,
                target = evt.target as HTMLElement;

            if (target && target.parentNode == self.container) {
                evt.preventDefault();

                self.dragging = true;
                self.click = getPoint(evt);
                
                self.makeDragItem(target);

                self.onMove(evt);
            }
        }
    }

    // on item release/drop 
    onRelease(e: Event) {
        this.dragging = false;
        this.trashDragItem();
    }

    // on item drag/move
    onMove(e: MouseEvent) {
        let self = this;

        if (self.dragItem && self.dragging) {
            e.preventDefault();

            let point = getPoint(e),
                container = self.container;

            // drag fake item 
            self.moveItem(self.dragItem, (point.x - self.click.x), (point.y - self.click.y));

            // keep an eye for other sortable lists and switch over to it on hover 
            for (var a = 0; a < self.sortLists.length; ++a) {
                var subContainer = self.sortLists[a];

                if (self.isOnTop(subContainer, point.x, point.y)) {
                    container = subContainer;
                }
            }

            // container is empty, move clicked item over to it on hover 
            if (self.isOnTop(container, point.x, point.y) && container.children.length === 0) {
                if (self.clickItem) {
                    container.appendChild(self.clickItem);
                }
                return;
            }

            // check if current drag item is over another item and swap places 
            for (var b = 0; b < container.children.length; ++b) {
                var subItem: HTMLElement = container.children[b] as HTMLElement;

                if (subItem) {
                    if (subItem === self.clickItem || subItem === self.dragItem) {
                        continue;
                    }

                    if (self.isOnTop(subItem, point.x, point.y)) {
                        self.hovItem = subItem;

                        if (self.clickItem) {
                            self.swapItems(self.clickItem, subItem);
                        }
                    }
                }
            }
        }
    }
}