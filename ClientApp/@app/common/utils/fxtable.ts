import { ko, $ } from '@app/providers';

export class fxTable {
    initial: number | null = null;

    options: {
        width: number | string;
        displayRow: number;
        fixedColumn: number;
        rowHeight: number;
        autoWidth: boolean;
    } = {
            width: 400,
            displayRow: 10,
            fixedColumn: 0,
            rowHeight: 30,
            autoWidth: false
        };

    elements: {
        container: HTMLDivElement,
        fixedHeader: HTMLDivElement,
        scrollHeader: HTMLDivElement,
        fixedBody: HTMLDivElement,
        scrollBody: HTMLDivElement,
        table: HTMLTableElement
    } = {
            container: document.createElement('div'),
            fixedHeader: document.createElement('div'),
            scrollHeader: document.createElement('div'),
            fixedBody: document.createElement('div'),
            scrollBody: document.createElement('div'),
            table: document.createElement('table')
        };

    constructor(table: HTMLTableElement, options?: {
        width: number | string;
        displayRow: number;
        fixedColumn: number;
    }) {
        let self = this;

        options = options || self.options;

        ko.utils.extend(self.options, options);

        if (!self.options.width) {
            self.options.autoWidth = true;
            ko.utils.extend(self.options, {
                width: table.getBoundingClientRect().width
            });
        }

        self.elements = self.createElements();
        self.elements.table = table;

        if (!table.className) {
            table.className = 'fx-table';
        } else {
            table.classList.add('fx-table');
        }

        table.parentElement!.replaceChild(self.elements.container, table);

        self.elements.container.style.width = `${self.options.width}px`;

        if (self.options.autoWidth && self.elements.scrollBody.clientWidth - self.elements.scrollBody.scrollWidth < 20) {
            if (!self.initial) {
                self.initial = setTimeout(function () {
                    self.initial = null;
                    let body = self.elements.scrollBody;
                    self.elements.container.style.width = self.elements.container.scrollWidth + (body.scrollWidth - body.clientWidth) + 'px';
                }, 500);
            }
        }

        self.elements.scrollBody.appendChild(table);

        self.initLayout();

        self.elements.table.querySelector('tbody')!.addEventListener('DOMNodeInserted', function (evt: Event) {
            if (!self.initial) {
                self.initial = setTimeout(function () {
                    self.initLayout();
                }, 0);
            }
        });

        self.elements.table.querySelector('tbody')!.addEventListener('DOMNodeRemoved', function () {
            if (!self.initial) {
                self.initial = setTimeout(function () {
                    self.initLayout();
                }, 0);
            }
        });
    }

    initLayout() {
        let self = this,
            options = self.options,
            elements = self.elements,
            fc = options.fixedColumn,
            table = self.elements.table,
            thead = table.querySelector('thead'),
            tbody = table.querySelector('tbody');

        self.clearStyle();

        // copy and restyle all element
        if (thead) {
            let ftrs: HTMLTableRowElement[] = [],
                strs: HTMLTableRowElement[] = [];

            [].slice.call(thead.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                let frow = document.createElement('tr'),
                    srow = document.createElement('tr');

                frow.style.height = tr.getBoundingClientRect().height + 'px';
                srow.style.height = tr.getBoundingClientRect().height + 'px';

                [].slice.call(tr.querySelectorAll('th')).forEach((th: HTMLTableHeaderCellElement, i: number) => {
                    th.style.minWidth = th.getBoundingClientRect().width + 'px';

                    if (i < fc) {
                        let cth = th.cloneNode(true) as HTMLTableHeaderCellElement;
                        cth.style.display = "none";

                        th.parentElement!.replaceChild(cth, th);

                        frow.appendChild(th);

                        ko.utils.domData.set(tr, 'delete_cell' + i, cth);
                        ko.utils.domData.set(tr, 'restore_cell' + i, th);
                    } else {
                        let cth = th.cloneNode(true) as HTMLTableHeaderCellElement;
                        cth.style.display = "none";

                        th.parentElement!.replaceChild(cth, th);

                        srow.appendChild(th);

                        ko.utils.domData.set(tr, 'delete_cell' + i, cth);
                        ko.utils.domData.set(tr, 'restore_cell' + i, th);
                    }
                });

                ftrs.push(frow);
                strs.push(srow);
            });

            if (!fc) {
                elements.fixedHeader.setAttribute('style', 'display: none');
                elements.scrollHeader.style.borderLeft = null;
            } else {
                self.initTableContent(elements.fixedHeader, ftrs, CONTENT_TYPE.FIXED_HEAD);
            }

            self.initTableContent(elements.scrollHeader, strs, CONTENT_TYPE.SCROLL_HEAD);

            thead.style.display = "none";
        }

        if (tbody) {
            let trs: HTMLTableRowElement[] = [].slice.call(tbody.querySelectorAll('tr')),
                ftds: HTMLTableRowElement[] = [];

            options.rowHeight = tbody.querySelector('tr')!.offsetHeight;

            trs.forEach((tr: HTMLTableRowElement) => {
                let row = document.createElement('tr');
                row.style.height = tr.getBoundingClientRect().height + 'px';

                [].slice.call(tr.querySelectorAll('td')).forEach((td: HTMLTableDataCellElement, i: number) => {
                    if (i < fc) {
                        let ctd = td.cloneNode(true) as HTMLTableDataCellElement;

                        ctd.style.display = "none";

                        td.parentElement!.replaceChild(ctd, td);

                        row.appendChild(td as HTMLTableDataCellElement);

                        ko.utils.domData.set(tr, 'delete_cell' + i, ctd);
                        ko.utils.domData.set(tr, 'restore_cell' + i, td);
                    }
                });

                ftds.push(row);
            });

            if (!fc) {
                elements.fixedBody.setAttribute('style', 'display: none');
                elements.scrollBody.style.borderLeft = null;
            } else {
                self.initTableContent(elements.fixedBody, ftds, CONTENT_TYPE.FIXED_BODY);
            }
        }

        if (elements.fixedHeader.getBoundingClientRect().width < elements.fixedBody.getBoundingClientRect().width) {
            elements.fixedHeader.style.width = elements.fixedBody.getBoundingClientRect().width + 'px';
        } else {
            elements.fixedBody.style.width = elements.fixedHeader.getBoundingClientRect().width + 'px';
        }

        if (fc) {
            elements.scrollBody.style.width = elements.container.getBoundingClientRect().width - elements.fixedBody.getBoundingClientRect().width - 2 + 'px';
        }

        elements.scrollBody.style.height = (options.rowHeight + 1) * options.displayRow + 'px';

        if (elements.scrollBody.clientHeight <= (options.rowHeight + 1) * options.displayRow) {
            elements.scrollBody.style.height = elements.scrollBody.offsetHeight + (elements.scrollBody.offsetHeight - elements.scrollBody.clientHeight) + 'px';
        }

        elements.scrollBody.dispatchEvent(new Event('resize'));

        self.initial = null;
    }

    initTableContent(element: HTMLDivElement, contents: HTMLElement[], type: CONTENT_TYPE) {
        let table = document.createElement('table'),
            body = document.createElement([CONTENT_TYPE.FIXED_HEAD, CONTENT_TYPE.SCROLL_HEAD].indexOf(type) > -1 ? 'thead' : 'tbody');

        table.setAttribute('class', 'fx-table');

        table.appendChild(body);

        element.appendChild(table);

        contents.forEach((content: HTMLElement) => body.appendChild(content));
    }

    createElements() {
        let container = document.createElement('div'),
            rowHeader = document.createElement('div'),
            fixedHeader = document.createElement('div'),
            scrollHeader = document.createElement('div'),
            rowBody = document.createElement('div'),
            fixedBody = document.createElement('div'),
            scrollBody = document.createElement('div'),
            cf = document.createElement('div');

        cf.style.clear = 'both';

        container.setAttribute('class', 'fx-container');
        container.style.border = '1px solid #ccc';
        container.style.marginBottom = '25px';

        rowHeader.setAttribute('class', 'fx-row-header');

        rowBody.style.borderTop = '1px solid #ccc';
        rowBody.setAttribute('class', 'fx-row-body');

        fixedHeader.style.cssFloat = 'left';
        fixedHeader.style.verticalAlign = 'top';
        fixedHeader.setAttribute('class', 'fx-fixed-header');

        scrollHeader.style.cssFloat = 'left';
        scrollHeader.style.borderLeft = '2px solid #ccc';
        scrollHeader.setAttribute('class', 'fx-scroll-header');

        fixedBody.style.cssFloat = 'left';
        fixedBody.style.verticalAlign = 'top';
        fixedBody.style.borderBottom = '1px solid #ccc';
        fixedBody.setAttribute('class', 'fx-fixed-body');

        scrollBody.style.cssFloat = 'float';
        scrollBody.style.overflow = 'auto';
        scrollBody.style.borderLeft = '2px solid #ccc';
        scrollBody.setAttribute('class', 'fx-scroll-body');

        // add row;
        container.appendChild(rowHeader);
        container.appendChild(rowBody);

        rowHeader.appendChild(fixedHeader);
        rowHeader.appendChild(scrollHeader);
        rowHeader.appendChild(cf.cloneNode());

        rowBody.appendChild(fixedBody);
        rowBody.appendChild(scrollBody);
        rowBody.appendChild(cf.cloneNode());

        container.style.overflow = "hidden";
        fixedHeader.style.overflow = "hidden";
        scrollHeader.style.overflow = "hidden";
        fixedBody.style.overflow = "hidden";

        scrollBody.addEventListener('resize', (evt: Event) => {
            fixedBody.style.height = scrollBody.clientHeight + 1 + 'px';
            scrollHeader.style.width = scrollBody.clientWidth + 2 + 'px';
        });

        scrollBody.addEventListener('scroll', function (evt: Event) {
            scrollHeader.scrollLeft = scrollBody.scrollLeft;
            fixedBody.scrollTop = scrollBody.scrollTop;

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        fixedBody.addEventListener('scroll', function (evt: Event) {
            scrollBody.scrollTop = fixedBody.scrollTop;
        });

        scrollBody.addEventListener('wheel', (evt: WheelEvent) => {
            let step = evt.deltaY ? 125 : 40,
                wheel = (evt.deltaY || evt.wheelDeltaY);

            if (!evt.shiftKey) {
                if (wheel > 0) {
                    scrollBody.scrollTop -= step;
                } else {
                    scrollBody.scrollTop += step;
                }
            } else {
                if (wheel > 0) {
                    scrollBody.scrollLeft -= step;
                } else {
                    scrollBody.scrollLeft += step;
                }
            }

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        fixedBody.addEventListener('wheel', (evt: WheelEvent) => {
            let step = evt.deltaY ? 125 : 40,
                wheel = (evt.deltaY || evt.wheelDeltaY);

            if (!evt.shiftKey) {
                if (wheel > 0) {
                    scrollBody.scrollTop -= step;
                } else {
                    scrollBody.scrollTop += step;
                }
            } else {
                if (wheel > 0) {
                    scrollBody.scrollLeft -= step;
                } else {
                    scrollBody.scrollLeft += step;
                }
            }

            // cancel all scroll event of parents
            evt.preventDefault();
        })

        return {
            container: container,
            fixedHeader: fixedHeader,
            scrollHeader: scrollHeader,
            fixedBody: fixedBody,
            scrollBody: scrollBody,
            table: document.createElement('table')
        };
    }

    clearStyle() {
        let self = this,
            head = self.elements.table.querySelector('thead'),
            body = self.elements.table.querySelector('tbody');

        [].slice.call(head!.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
            [].slice.call(tr.querySelectorAll('th')).forEach((th: any, i: number) => {
                let d = ko.utils.domData.get(tr, 'delete_cell' + i),
                    r = ko.utils.domData.get(tr, 'restore_cell' + i);

                if (d && r) {
                    tr.replaceChild(r, d);
                }
            });
        });

        [].slice.call(body!.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
            [].slice.call(tr.querySelectorAll('td')).forEach((td: any, i: number) => {
                let d = ko.utils.domData.get(tr, 'delete_cell' + i),
                    r = ko.utils.domData.get(tr, 'restore_cell' + i);

                if (d && r) {
                    tr.replaceChild(r, d);
                }
            });
        });

        self.elements.table.removeAttribute('style');

        if (head) {
            head.removeAttribute('style');

            [].slice.call(head.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                tr.removeAttribute('style');

                [].slice.call(tr.querySelectorAll('th')).forEach((th: HTMLTableHeaderCellElement) => {
                    th.removeAttribute('style');
                    th.style.overflow = 'hidden';
                    th.style.textOverflow = 'ellipsis';
                })
            });
        }

        if (body) {
            body.setAttribute('style', '');

            [].slice.call(body.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement, i: number) => {
                tr.removeAttribute('style');
                tr.setAttribute('row', `${i}`);

                [].slice.call(tr.querySelectorAll('td')).forEach((td: HTMLTableDataCellElement, j: number) => {
                    td.removeAttribute('style');
                    td.setAttribute('column', `${j}`);
                })
            });
        }

        self.elements.fixedBody.innerHTML = '';
        self.elements.fixedHeader.innerHTML = '';
        self.elements.scrollHeader.innerHTML = '';
    }
}

enum CONTENT_TYPE {
    FIXED_HEAD = <any>'FIXED_HEAD',
    SCROLL_HEAD = <any>'SCROLL_HEAD',
    FIXED_BODY = <any>'FIXED_BODY',
    SCROLL_BODY = <any>'SCROLL_BODY',
}