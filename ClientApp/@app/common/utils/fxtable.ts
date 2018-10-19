import { ko, $ } from '@app/providers';

export class fxTable {
    initial: number | null = null;

    options: {
        width: number | string;
        displayRow: number;
        fixedColumn: number;
        rowHeight: number;
        autoWidth: boolean;
        border: string;
    } = {
            width: 400,
            displayRow: 10,
            fixedColumn: 0,
            rowHeight: 30,
            autoWidth: false,
            border: '1px solid #dcdcdc'
        };

    elements: {
        container: HTMLDivElement;
        fixedHeader: HTMLDivElement;
        scrollHeader: HTMLDivElement;
        fixedBody: HTMLDivElement;
        scrollBody: HTMLDivElement;
        fixedFooter: HTMLDivElement;
        scrollFooter: HTMLDivElement;
        table: HTMLTableElement;
    } = {
            container: document.createElement('div'),
            fixedHeader: document.createElement('div'),
            scrollHeader: document.createElement('div'),
            fixedBody: document.createElement('div'),
            scrollBody: document.createElement('div'),
            fixedFooter: document.createElement('div'),
            scrollFooter: document.createElement('div'),
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

        self.elements.scrollBody.appendChild(table);

        self.elements.container.style.width = `${self.options.width}px`;

        /*if (self.options.autoWidth && self.elements.scrollBody.clientWidth - self.elements.scrollBody.scrollWidth < 20) {
            if (!self.initial) {
                self.initial = setTimeout(function () {
                    self.initial = null;
                    let body = self.elements.scrollBody;
                    self.elements.container.style.width = self.elements.container.scrollWidth + (body.scrollWidth - body.clientWidth) + 'px';
                }, 500);
            }
        }*/

        self.initLayout();

        let body = self.elements.table.querySelector('tbody');

        ['DOMNodeInserted', 'DOMNodeRemoved'].forEach((evt: string) => {
            if (body) {
                body.addEventListener(evt, (evt) => {
                    if (!self.initial) {
                        self.initial = setTimeout(function () {
                            self.initLayout();
                        }, 10);
                    }
                });
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
            tbody = table.querySelector('tbody'),
            tfoot = table.querySelector('tfoot'),
            scrollBody = elements.scrollBody;

        self.clearStyle();

        // copy and restyle all element
        if (thead) {
            let ftrs: HTMLTableRowElement[] = [],
                strs: HTMLTableRowElement[] = [];

            [].slice.call(thead.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    let frow = document.createElement('tr'),
                        srow = document.createElement('tr');

                    frow.style.borderBottom = options.border;
                    srow.style.borderBottom = options.border;

                    //frow.style.height = tr.getBoundingClientRect().height + 'px';
                    //srow.style.height = tr.getBoundingClientRect().height + 'px';

                    [].slice.call(tr.querySelectorAll('th')).forEach((th: HTMLTableHeaderCellElement, i: number) => {
                        if (th) {
                            //th.style.minWidth = th.getBoundingClientRect().width + 'px';

                            if (i < fc) {
                                let cth = document.createElement('th');
                                cth.style.display = "none";

                                th.parentElement!.replaceChild(cth, th);

                                frow.appendChild(th);

                                ko.utils.domData.set(tr, 'delete_cell' + i, cth);
                                ko.utils.domData.set(tr, 'restore_cell' + i, th);
                            } else {
                                let cth = document.createElement('th');
                                cth.style.display = "none";

                                th.parentElement!.replaceChild(cth, th);

                                srow.appendChild(th);

                                ko.utils.domData.set(tr, 'delete_cell' + i, cth);
                                ko.utils.domData.set(tr, 'restore_cell' + i, th);
                            }
                        }
                    });

                    ftrs.push(frow);
                    strs.push(srow);
                }
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
                ftds: HTMLTableRowElement[] = [],
                fr = tbody.querySelector('tr') as HTMLTableRowElement;

            if (fr) {
                options.rowHeight = fr.offsetHeight;
            }

            trs.forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    let row = document.createElement('tr');

                    //row.style.height = tr.getBoundingClientRect().height + 'px';

                    [].slice.call(tr.querySelectorAll('td')).forEach((td: HTMLTableDataCellElement, i: number) => {
                        if (td && i < fc) {
                            let ctd = document.createElement('td');

                            ctd.style.display = "none";
                            td.style.minWidth = td.width + 'px';
                            //td.style.height = td.height + 'px';
                            td.parentElement!.replaceChild(ctd, td);

                            row.appendChild(td);

                            ko.utils.domData.set(tr, 'delete_cell' + i, ctd);
                            ko.utils.domData.set(tr, 'restore_cell' + i, td);
                        }
                    });

                    ftds.push(row);
                }
            });

            if (!fc) {
                elements.fixedBody.setAttribute('style', 'display: none');
                scrollBody.style.borderLeft = null;
            } else {
                self.initTableContent(elements.fixedBody, ftds, CONTENT_TYPE.FIXED_BODY);
            }
        }

        if (tfoot) {
            let ftrs: HTMLTableRowElement[] = [],
                strs: HTMLTableRowElement[] = [];

            [].slice.call(tfoot.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    let frow = document.createElement('tr'),
                        srow = document.createElement('tr');

                    frow.style.borderBottom = options.border;
                    srow.style.borderBottom = options.border;

                    frow.style.height = tr.getBoundingClientRect().height + 'px';
                    srow.style.height = tr.getBoundingClientRect().height + 'px';

                    [].slice.call(tr.querySelectorAll('th')).forEach((th: HTMLTableHeaderCellElement, i: number) => {
                        if (th) {
                            if (i < fc) {
                                let cth = document.createElement('th');
                                cth.style.display = "none";

                                th.parentElement!.replaceChild(cth, th);

                                frow.appendChild(th);

                                ko.utils.domData.set(tr, 'delete_cell' + i, cth);
                                ko.utils.domData.set(tr, 'restore_cell' + i, th);
                            } else {
                                let cth = document.createElement('th');
                                cth.style.display = "none";

                                th.parentElement!.replaceChild(cth, th);

                                srow.appendChild(th);

                                ko.utils.domData.set(tr, 'delete_cell' + i, cth);
                                ko.utils.domData.set(tr, 'restore_cell' + i, th);
                            }
                        }
                    });

                    ftrs.push(frow);
                    strs.push(srow);
                }
            });

            if (fc) {
                self.initTableContent(elements.fixedFooter, ftrs, CONTENT_TYPE.FIXED_FOOT);
            }

            self.initTableContent(elements.scrollFooter, strs, CONTENT_TYPE.SCROLL_FOOT);

            tfoot.style.display = "none";
        }

        if (elements.fixedHeader.getBoundingClientRect().width < elements.fixedBody.getBoundingClientRect().width) {
            elements.fixedHeader.style.width = elements.fixedBody.getBoundingClientRect().width + 'px';
        } else {
            elements.fixedBody.style.width = elements.fixedHeader.getBoundingClientRect().width + 'px';
        }

        if (fc) {
            scrollBody.style.width = elements.container.getBoundingClientRect().width - elements.fixedBody.getBoundingClientRect().width - 2 + 'px';
        }

        scrollBody.style.height = options.rowHeight * options.displayRow - 1 + 'px';

        ko.utils.triggerEvent(scrollBody, 'resize');

        self.initial = null;
    }

    initTableContent(element: HTMLDivElement, contents: HTMLElement[], type: CONTENT_TYPE) {
        let self = this,
            elements = self.elements,
            table = document.createElement('table'),
            isHeader = [CONTENT_TYPE.FIXED_HEAD, CONTENT_TYPE.SCROLL_HEAD].indexOf(type) > -1,
            body = document.createElement(isHeader ? 'thead' : 'tbody');

        table.setAttribute('class', elements.table.className);

        table.style.minWidth = "100%"

        table.appendChild(body);

        element.appendChild(table);

        contents.forEach((row: HTMLElement, i: number) => {
            body.appendChild(row);

            row.style.display = 'block';
            if (isHeader && i == contents.length - 1) {
                row.style.borderBottom = null;
            }
        });
    }

    createElements() {
        let self = this,
            options = self.options,
            container = document.createElement('div'),
            rowHeader = document.createElement('div'),
            fixedHeader = document.createElement('div'),
            scrollHeader = document.createElement('div'),
            rowBody = document.createElement('div'),
            fixedBody = document.createElement('div'),
            scrollBody = document.createElement('div'),
            fixedFooter = document.createElement('div'),
            scrollFooter = document.createElement('div'),
            rowFooter = document.createElement('div'),
            cf = document.createElement('div');

        cf.style.clear = 'both';

        container.setAttribute('class', 'fx-container');
        container.style.border = options.border;
        container.style.marginBottom = '25px';

        rowHeader.setAttribute('class', 'fx-row-header');

        rowBody.style.borderTop = options.border;
        rowBody.setAttribute('class', 'fx-row-body');

        rowFooter.style.borderTop = options.border;
        rowFooter.setAttribute('class', 'fx-row-footer');

        fixedHeader.style.cssFloat = 'left';
        fixedHeader.style.verticalAlign = 'top';
        fixedHeader.setAttribute('class', 'fx-fixed-header');

        scrollHeader.style.cssFloat = 'left';
        scrollHeader.style.borderLeft = options.border;
        scrollHeader.style.borderRight = options.border;
        scrollHeader.setAttribute('class', 'fx-scroll-header');

        fixedBody.style.cssFloat = 'left';
        fixedBody.style.verticalAlign = 'top';
        //fixedBody.style.borderBottom = '1px solid #eee';
        fixedBody.setAttribute('class', 'fx-fixed-body');

        scrollBody.style.cssFloat = 'float';
        scrollBody.style.overflow = 'hidden';
        scrollBody.style.overflowY = 'auto';
        scrollBody.style.borderBottom = '0px';
        scrollBody.style.borderLeft = options.border;
        scrollBody.setAttribute('class', 'fx-scroll-body');

        fixedFooter.style.cssFloat = 'left';
        fixedFooter.style.verticalAlign = 'top';
        //fixedFooter.style.borderBottom = options.border;
        fixedFooter.setAttribute('class', 'fx-fixed-footer');

        scrollFooter.style.cssFloat = 'left';
        scrollFooter.style.overflow = 'hidden';
        scrollFooter.style.overflowX = 'auto';
        scrollFooter.style.borderLeft = options.border;
        scrollFooter.style.borderRight = options.border;
        scrollFooter.setAttribute('class', 'fx-scroll-footer');

        // add row;
        container.appendChild(rowHeader);
        container.appendChild(rowBody);
        container.appendChild(rowFooter);

        rowHeader.appendChild(fixedHeader);
        rowHeader.appendChild(scrollHeader);
        rowHeader.appendChild(cf.cloneNode());

        rowBody.appendChild(fixedBody);
        rowBody.appendChild(scrollBody);
        rowBody.appendChild(cf.cloneNode());

        rowFooter.appendChild(fixedFooter);
        rowFooter.appendChild(scrollFooter);
        rowFooter.appendChild(cf.cloneNode());

        container.style.overflow = "hidden";
        fixedHeader.style.overflow = "hidden";
        scrollHeader.style.overflow = "hidden";
        fixedBody.style.overflow = "hidden";

        ko.utils.registerEventHandler(fixedBody, 'resize', (evt: Event) => {
            fixedHeader.style.width = fixedBody.clientWidth + 'px';
            fixedFooter.style.width = fixedBody.clientWidth + 'px';
        });

        ko.utils.registerEventHandler(scrollBody, 'resize', (evt: Event) => {
            let scrollY = scrollBody.offsetWidth - scrollBody.clientWidth > 1,
                scrollX = scrollBody.offsetHeight - scrollBody.clientHeight > 0;

            if (!scrollX) {
                scrollBody.style.overflowY = 'auto';
            } else {
                scrollBody.style.overflowY = 'hidden';
            }

            if (!scrollY) {
                scrollHeader.style.borderRight = '0px';
                scrollFooter.style.borderRight = '0px';
            } else {
                scrollHeader.style.borderRight = options.border;
                scrollFooter.style.borderRight = options.border;
            }

            fixedBody.style.height = scrollBody.offsetHeight + 'px';

            scrollHeader.style.width = scrollBody.clientWidth + (scrollY ? 2 : 1) + 'px';
            scrollFooter.style.width = scrollBody.clientWidth + (scrollY ? 2 : 1) + 'px';

            ko.utils.triggerEvent(fixedBody, 'resize');
        });

        ko.utils.registerEventHandler(scrollBody, 'scroll', (evt: Event) => {
            fixedBody.scrollTop = scrollBody.scrollTop;

            scrollHeader.scrollLeft = scrollBody.scrollLeft;
            scrollFooter.scrollLeft = scrollBody.scrollLeft;

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        ko.utils.registerEventHandler(fixedBody, 'scroll', (evt: Event) => {
            scrollBody.scrollTop = fixedBody.scrollTop;

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        ko.utils.registerEventHandler(scrollFooter, 'scroll', (evt: Event) => {
            scrollBody.scrollLeft = scrollFooter.scrollLeft;
            scrollHeader.scrollLeft = scrollFooter.scrollLeft;

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        ko.utils.registerEventHandler(container, 'wheel', (evt: WheelEvent) => {
            let step = evt.deltaY ? 125 : 40,
                wheel = (evt.deltaY || evt.wheelDeltaY),
                scrollY = scrollBody.offsetWidth - scrollBody.clientWidth > 1;

            if (evt.shiftKey || !scrollY) {
                if (wheel > 0) {
                    scrollBody.scrollLeft += step;
                } else {
                    scrollBody.scrollLeft -= step;
                }
            } else {
                if (wheel > 0) {
                    scrollBody.scrollTop += step;
                } else {
                    scrollBody.scrollTop -= step;
                }
            }

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        return {
            container: container,
            fixedHeader: fixedHeader,
            scrollHeader: scrollHeader,
            fixedBody: fixedBody,
            scrollBody: scrollBody,
            fixedFooter: fixedFooter,
            scrollFooter: scrollFooter,
            table: document.createElement('table')
        };
    }

    clearStyle() {
        let self = this,
            options = self.options,
            elements = self.elements,
            container = elements.container,
            head = elements.table.querySelector('thead'),
            body = elements.table.querySelector('tbody'),
            foot = elements.table.querySelector('tfoot');

        if (!head) {
            (container.querySelector('.fx-row-body') as HTMLElement).style.borderTop = '0px';
        } else {
            [].slice.call(head!.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    [].slice.call(tr.querySelectorAll('th')).forEach((th: any, i: number) => {
                        if (th) {
                            let d = ko.utils.domData.get(tr, 'delete_cell' + i),
                                r = ko.utils.domData.get(tr, 'restore_cell' + i);

                            if (d && r) {
                                tr.replaceChild(r, d);
                            }
                        }
                    });
                }
            });
            (container.querySelector('.fx-row-body') as HTMLElement).style.borderTop = options.border;
        }

        if (body) {
            let trs = [].slice.call(body.querySelectorAll('tr'));

            trs.forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    [].slice.call(tr.querySelectorAll('td')).forEach((td: any, i: number) => {
                        if (td) {
                            let d = ko.utils.domData.get(tr, 'delete_cell' + i),
                                r = ko.utils.domData.get(tr, 'restore_cell' + i);

                            if (d && r) {
                                tr.replaceChild(r, d);
                            }
                        }
                    });
                }
            });
        }

        if (foot) {
            [].slice.call(foot.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    [].slice.call(tr.querySelectorAll('th')).forEach((th: any, i: number) => {
                        if (th) {
                            let d = ko.utils.domData.get(tr, 'delete_cell' + i),
                                r = ko.utils.domData.get(tr, 'restore_cell' + i);

                            if (d && r) {
                                tr.replaceChild(r, d);
                            }
                        }
                    });
                }
            });
        }

        elements.table.removeAttribute('style');
        elements.table.style.minWidth = "100%";

        if (head) {
            head.removeAttribute('style');

            [].slice.call(head.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    tr.removeAttribute('style');
                    tr.style.display = 'block';
                    tr.style.borderBottom = options.border;
                    tr.style.minHeight = options.rowHeight + 'px';

                    let ths = [].slice.call(tr.querySelectorAll('th'));
                    ths.forEach((th: HTMLTableHeaderCellElement, j: number) => {
                        if (th) {
                            th.removeAttribute('style');
                            th.style.boxSizing = 'border-box';
                            th.style.overflow = 'hidden';
                            th.style.textOverflow = 'ellipsis';

                            if (j == ths.length - 1) {
                                th.style.borderRight = '0px';
                            }
                        }
                    });
                }
            });
        }

        if (body) {
            body.setAttribute('style', '');
            let trs = [].slice.call(body.querySelectorAll('tr'));

            trs.forEach((tr: HTMLTableRowElement, i: number) => {
                if (tr) {

                    tr.removeAttribute('style');

                    tr.style.display = 'block';

                    if (i + 1 >= options.displayRow && i == trs.length - 1) {
                        tr.style.borderBottom = '0px';
                    } else {
                        tr.style.borderBottom = options.border;
                    }

                    tr.style.minHeight = options.rowHeight + 'px';

                    tr.setAttribute('row', `${i}`);

                    let tds = [].slice.call(tr.querySelectorAll('td'));

                    tds.forEach((td: HTMLTableDataCellElement, j: number) => {
                        if (td) {
                            td.removeAttribute('style');
                            td.style.boxSizing = 'border-box';
                            td.setAttribute('column', `${j}`);

                            if (j == tds.length - 1) {
                                td.style.borderRight = '0px';
                            }
                        }
                    });
                }
            });
        }

        if (foot) {
            foot.removeAttribute('style');

            [].slice.call(foot.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                if (tr) {
                    tr.removeAttribute('style');
                    tr.style.display = 'block';
                    tr.style.borderBottom = options.border;
                    tr.style.minHeight = options.rowHeight + 'px';

                    let ths = [].slice.call(tr.querySelectorAll('th'));
                    ths.forEach((th: HTMLTableHeaderCellElement, j: number) => {
                        if (th) {
                            th.removeAttribute('style');
                            th.style.boxSizing = 'border-box';
                            th.style.overflow = 'hidden';
                            th.style.textOverflow = 'ellipsis';

                            if (j == ths.length - 1) {
                                th.style.borderRight = '0px';
                            }
                        }
                    });
                }
            });
        }

        elements.fixedBody.innerHTML = '';
        elements.fixedHeader.innerHTML = '';
        elements.scrollHeader.innerHTML = '';
        elements.fixedFooter.innerHTML = '';
        elements.scrollFooter.innerHTML = '';
    }
}

enum CONTENT_TYPE {
    FIXED_HEAD = <any>'FIXED_HEAD',
    SCROLL_HEAD = <any>'SCROLL_HEAD',
    FIXED_BODY = <any>'FIXED_BODY',
    SCROLL_BODY = <any>'SCROLL_BODY',
    FIXED_FOOT = <any>'FIXED_FOOT',
    SCROLL_FOOT = <any>'SCROLL_FOOT'
}