import { ko } from '@app/providers';

let domData = ko.utils.domData;

export class fxTable {
    container: HTMLDivElement = document.createElement('div');

    options: IOptions = {
        width: 0,
        displayRow: 10,
        fixedColumn: 0,
        rowHeight: 0,
        columns: []
    };

    constructor(table: HTMLTableElement, options?: IOptions) {
        // init default elements;
        this.createElements();

        let self = this,
            elements = self.elements,
            dtbl = elements.tables.table,
            sbody = elements.body.scrollable;

        options = options || self.options;
        ko.utils.extend(self.options, options);

        if (!table.className) {
            table.className = 'fx-table';
        } else {
            table.classList.add('fx-table');
        }

        table.parentElement!.replaceChild(self.container, table);

        sbody.replaceChild(table, dtbl);

        // reload elements
        elements = self.elements;

        self.initLayout(elements);

        // reinit layout if window resize
        window.addEventListener('resize', () => self.initLayout(elements));

        // reinit layout if render body again
        let body = elements.tables.body;
        ['DOMNodeInserted', 'DOMNodeRemoved'].forEach((evt: string) => body && body.addEventListener(evt, () => self.initLayout(elements)));
    }

    initLayout(elements: IElements) {
        let self = this,
            ki = '__initialize__',
            options = self.options,
            container = self.container,
            initialize = domData.get(container, ki);

        if (initialize) {
            return;
        }

        domData.set(container, ki, true);

        setTimeout(() => {
            self.clearStyle(elements);

            self.roleBackItem(elements.tables);

            self.getRowHeight(elements.tables);

            self.moveFixedItem(elements, options);

            self.headStyle(elements);
            self.footStyle(elements);
            self.fixedStyle(elements);

            self.layoutStyle(elements);
            self.scrollStyle(elements);

            self.tableWidth();
            
            domData.set(container, ki, false);
        }, 50);
    }

    clearStyle(elements: IElements) {
        let self = this,
            head = elements.head,
            body = elements.body,
            foot = elements.foot,
            tables = elements.tables;

        self.roleBackItem(tables);

        head.row.removeAttribute('style');
        head.fixed.removeAttribute('style');
        head.scrollable.removeAttribute('style');

        body.row.removeAttribute('style');
        body.fixed.removeAttribute('style');
        body.scrollable.removeAttribute('style');

        foot.row.removeAttribute('style');
        foot.fixed.removeAttribute('style');
        foot.scrollable.removeAttribute('style');

        tables.table.removeAttribute('style');

        if (tables.head) {
            tables.head.removeAttribute('style');

            [].slice.call(tables.head.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                tr.removeAttribute('style');

                let ths = [].slice.call(tr.querySelectorAll('th'));
                ths.forEach((th: HTMLTableHeaderCellElement, j: number) => {
                    th.removeAttribute('style');
                });
            });
        }

        if (tables.body) {
            tables.body.setAttribute('style', '');
            let trs = [].slice.call(tables.body.querySelectorAll('tr'));

            trs.forEach((tr: HTMLTableRowElement, i: number) => {
                tr.removeAttribute('style');

                tr.setAttribute('row', `${i}`);

                let tds = [].slice.call(tr.querySelectorAll('td'));

                tds.forEach((td: HTMLTableDataCellElement, j: number) => {
                    td.removeAttribute('style');
                    td.setAttribute('column', `${j}`);
                });
            });
        }

        if (tables.foot) {
            tables.foot.removeAttribute('style');

            [].slice.call(tables.foot.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                tr.removeAttribute('style');

                let ths = [].slice.call(tr.querySelectorAll('th'));
                ths.forEach((th: HTMLTableHeaderCellElement, j: number) => {
                    th.removeAttribute('style');
                });
            });
        }

        head.fixed.innerHTML = '';
        head.scrollable.innerHTML = '';

        body.fixed.innerHTML = '';

        foot.fixed.innerHTML = '';
        foot.scrollable.innerHTML = '';
    }

    headStyle(elements: IElements) {
        let self = this,
            container = self.container,
            head = elements.head.row,
            hasHead = [].slice.call(head.querySelectorAll('table')).length > 0;

        if (hasHead) {
            container.classList.add('has-header');
        } else {
            container.classList.remove('has-header');
        }
    }

    fixedStyle(elements: IElements) {
        let self = this,
            container = self.container,
            fixedHead = elements.head.fixed,
            fixedBody = elements.body.fixed,
            fixedFoot = elements.foot.fixed,
            listFixed = [
                [].slice.call(fixedHead.querySelectorAll('table')).length,
                [].slice.call(fixedBody.querySelectorAll('table')).length,
                [].slice.call(fixedFoot.querySelectorAll('table')).length
            ];

        if (!!listFixed[0] || !!listFixed[1] || !!listFixed[2]) {
            container.classList.add('has-fixed');
        } else {
            container.classList.remove('has-fixed');
        }
    }

    footStyle(elements: IElements) {
        let self = this,
            container = self.container,
            foot = elements.foot.row,
            hasFoot = [].slice.call(foot.querySelectorAll('table')).length > 0;

        if (hasFoot) {
            container.classList.add('has-footer');
        } else {
            container.classList.remove('has-footer');
        }
    }

    layoutStyle(elements: IElements) {
        let self = this,
            options = self.options,
            container = self.container;

        [].slice.call(container.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
            let colSpan = -1;
            [].slice.call(tr.querySelectorAll('th, td')).forEach((t: HTMLTableCellElement, i: number) => {
                colSpan += t.colSpan;

                if (!t.classList.contains('fx-hidden')) {
                    let width = 0,
                        height = 0,
                        col = Math.max(i, colSpan);

                    for (let c = col; c < col + t.colSpan; c++) {
                        width += (options.columns[col] || 100);
                    }

                    t.style.minWidth = width + 'px';
                    t.style.maxWidth = width + 'px';

                    for (let r = 1; r <= t.rowSpan; r++) {
                        height += self.options.rowHeight;
                    }

                    t.style.height = height + 'px';
                }
            });
        });

        self.layoutWidth(elements);
    }

    scrollStyle(elements: IElements) {
        let self = this,
            options = self.options,
            container = self.container,
            body = elements.tables.body;

        let scrollHeadW = elements.head.scrollable.scrollWidth,
            scrollBodyW = elements.body.scrollable.scrollWidth,
            scrollFootW = elements.foot.scrollable.scrollWidth,
            scrollWidth = Math.max(scrollHeadW, scrollBodyW, scrollFootW),

            clientHeadW = elements.head.scrollable.clientWidth,
            clientBodyW = elements.body.scrollable.clientWidth,
            clientFootW = elements.foot.scrollable.clientWidth,
            clientWidth = Math.max(clientHeadW, clientBodyW, clientFootW);

        if (clientWidth < scrollWidth) {
            container.classList.add('has-scroll-x');
        } else {
            container.classList.remove('has-scroll-x');
        }

        if (body) {
            let row = [].slice.call(body.querySelectorAll('tr')).length;

            if (row > options.displayRow) {
                container.classList.add('has-scroll-y');

                if (!options.width) {
                    if (row == options.displayRow + 1) {
                        let scroll = self.getScroll(elements),
                            borderc = self.getBorder(container),
                            borders = self.getBorder(elements.body.scrollable),
                            fixedHeadW = elements.head.fixed.offsetWidth,
                            fixedBodyW = elements.body.fixed.offsetWidth,
                            fixedFootW = elements.foot.fixed.offsetWidth,
                            fixedWidth = Math.max(fixedHeadW, fixedBodyW, fixedFootW),
                            offsetWidth = elements.tables.table.offsetWidth;

                        if (container.offsetWidth < fixedWidth + offsetWidth + scroll.y) {
                            elements.body.scrollable.style.width = offsetWidth + scroll.y + borders.x + 'px';
                            container.style.width = fixedWidth + offsetWidth + scroll.y + (!options.width ? borders.x : 0) + borderc.x + 'px';
                        }
                    }
                }
            } else {
                container.classList.remove('has-scroll-y');

                if (!options.width) {
                    if (row == options.displayRow) {
                        let borderc = self.getBorder(container),
                            borders = self.getBorder(elements.body.scrollable),
                            fixedHeadW = elements.head.fixed.offsetWidth,
                            fixedBodyW = elements.body.fixed.offsetWidth,
                            fixedFootW = elements.foot.fixed.offsetWidth,
                            fixedWidth = Math.max(fixedHeadW, fixedBodyW, fixedFootW),
                            offsetWidth = elements.tables.table.offsetWidth;

                        if (container.clientWidth > fixedWidth + offsetWidth) {
                            container.style.width = fixedWidth + offsetWidth + borders.x + borderc.x + 'px';
                            elements.body.scrollable.style.width = offsetWidth + borders.x + 'px';
                        }
                    }
                }
            }

            let scroll = self.getScroll(elements),
                borders = self.getBorder(elements.body.scrollable);

            // get border-size replace 2 value
            elements.head.scrollable.style.width = elements.body.scrollable.offsetWidth - scroll.y + (scroll.y ? borders.x + 1 : 0) + 'px';
            elements.foot.scrollable.style.width = elements.body.scrollable.offsetWidth - scroll.y + (scroll.y ? borders.x + 1 : 0) + 'px';

            elements.body.fixed.style.height = options.displayRow * options.rowHeight + (scroll.x ? borders.y : 0) + 'px';
            elements.body.scrollable.style.height = options.displayRow * options.rowHeight + scroll.x + 'px';
        }
    }

    layoutWidth(elements: IElements) {
        let self = this,
            options = self.options,
            container = self.container,
            fixedHeadW = elements.head.fixed.offsetWidth,
            fixedBodyW = elements.body.fixed.offsetWidth,
            fixedFootW = elements.foot.fixed.offsetWidth,
            fixedWidth = Math.max(fixedHeadW, fixedBodyW, fixedFootW);

        if (options.width) {
            container.style.width = Math.abs(options.width) + 'px';
        } else {
            let border = self.getBorder(container),
                scrollHeadW = elements.head.scrollable.offsetWidth,
                scrollBodyW = elements.body.scrollable.offsetWidth,
                scrollFootW = elements.foot.scrollable.offsetWidth,
                scrollWidth = Math.max(scrollHeadW, scrollBodyW, scrollFootW);

            container.style.width = fixedWidth + scrollWidth + border.x + 'px';
        }

        let totalWidth = container.clientWidth;

        elements.head.fixed.style.width = fixedWidth + 'px';
        elements.body.fixed.style.width = fixedWidth + 'px';
        elements.foot.fixed.style.width = fixedWidth + 'px';

        elements.head.scrollable.style.width = totalWidth - fixedWidth + 'px';
        elements.body.scrollable.style.width = totalWidth - fixedWidth + 'px';
        elements.foot.scrollable.style.width = totalWidth - fixedWidth + 'px';

    }

    tableWidth() {
        let self = this,
            container = self.container,
            classList = container.classList;

        if (!(classList.contains('has-scroll-x') && classList.contains('has-scroll-y'))) {
            [].slice.call(container.querySelectorAll('table')).forEach((table: HTMLTableElement) => {
                table.style.width = '100%';
            });
        }
    }

    moveFixedItem(elements: IElements, options: IOptions) {
        let tables = elements.tables,
            tbName = tables.table.className,
            fixedColumn = options.fixedColumn,
            initTableContent = (contents: HTMLElement[], type: CONTENT_TYPE) => {
                let heads = [
                    CONTENT_TYPE.FIXED_HEAD,
                    CONTENT_TYPE.SCROLL_HEAD
                ], foots = [
                    CONTENT_TYPE.FIXED_FOOT,
                    CONTENT_TYPE.SCROLL_FOOT
                ],
                    isHeader = heads.indexOf(type) > -1,
                    isFooter = foots.indexOf(type) > -1,
                    table = document.createElement('table'),
                    body = document.createElement(isHeader ? 'thead' : (isFooter ? 'tfoot' : 'tbody'));

                table.className = tbName;

                table.appendChild(body);

                contents.forEach((row: HTMLElement, i: number) => body.appendChild(row));

                switch (type) {
                    case CONTENT_TYPE.FIXED_HEAD:
                        elements.head.fixed.appendChild(table)
                        break;
                    case CONTENT_TYPE.SCROLL_HEAD:
                        elements.head.scrollable.appendChild(table)
                        break;
                    case CONTENT_TYPE.FIXED_BODY:
                        elements.body.fixed.appendChild(table)
                        break;
                    case CONTENT_TYPE.FIXED_FOOT:
                        elements.foot.fixed.appendChild(table)
                        break;
                    case CONTENT_TYPE.SCROLL_FOOT:
                        elements.foot.scrollable.appendChild(table)
                        break;
                }
            };

        // copy and restyle all element
        if (tables.head) {
            let ftrs: HTMLTableRowElement[] = [],
                strs: HTMLTableRowElement[] = [],
                trs: HTMLTableRowElement[] = [].slice.call(tables.head.querySelectorAll('tr'));

            trs.forEach((tr: HTMLTableRowElement) => {
                let fc: number = domData.get(tr, 'fixed_counts') || 0,
                    frow = document.createElement('tr'),
                    srow = document.createElement('tr');

                [].slice.call(tr.querySelectorAll('th')).forEach((oth: HTMLTableHeaderCellElement, i: number) => {
                    let cth = document.createElement('th'),
                        colSpan = oth.colSpan || 1,
                        rowSpan = oth.rowSpan || 1;

                    fc += colSpan;

                    if (rowSpan > 1) {
                        for (let k = i + 1; k <= i + rowSpan - 1; k++) {
                            let nextRow = trs[k];

                            if (nextRow) {
                                let cs: number = domData.get(trs[k], 'fixed_counts') || 0;

                                domData.set(nextRow, 'fixed_counts', cs + colSpan);
                            }
                        }
                    }

                    cth.className = oth.className;
                    oth.parentElement!.replaceChild(cth, oth);

                    if (fc <= fixedColumn) {
                        let hth = oth.cloneNode() as HTMLTableHeaderCellElement;

                        hth.removeAttribute('data-bind');
                        hth.innerHTML = '&nbsp;';
                        hth.className = oth.className;

                        if (!hth.className) {
                            hth.className = 'fx-hidden';
                        } else {
                            hth.classList.add('fx-hidden');
                        }

                        frow.appendChild(oth);
                        srow.appendChild(hth);
                    } else {
                        let hth = oth.cloneNode() as HTMLTableHeaderCellElement;

                        hth.removeAttribute('data-bind');
                        hth.innerHTML = '&nbsp;';
                        hth.className = oth.className;

                        if (!hth.className) {
                            hth.className = 'fx-hidden';
                        } else {
                            hth.classList.add('fx-hidden');
                        }

                        frow.appendChild(hth);
                        srow.appendChild(oth);
                    }

                    domData.set(tr, 'delete_cell' + i, cth);
                    domData.set(tr, 'restore_cell' + i, oth);
                });

                ftrs.push(frow);
                strs.push(srow);
            });

            if (fixedColumn) {
                initTableContent(ftrs, CONTENT_TYPE.FIXED_HEAD);
            }

            initTableContent(strs, CONTENT_TYPE.SCROLL_HEAD);
        }

        if (tables.body) {
            let trs: HTMLTableRowElement[] = [].slice.call(tables.body.querySelectorAll('tr')),
                ftds: HTMLTableRowElement[] = [];

            trs.forEach((tr: HTMLTableRowElement, r: number) => {
                let fc: number = domData.get(tr, 'fixed_counts') || 0,
                    row: HTMLTableRowElement = document.createElement('tr');

                [].slice.call(tr.querySelectorAll('th, td')).forEach((td: HTMLTableDataCellElement, i: number) => {
                    let ctd = document.createElement('td'),
                        colSpan = td.colSpan || 1,
                        rowSpan = td.rowSpan || 1;

                    fc += colSpan;

                    if (rowSpan > 1) {
                        for (let k = i + 1; k <= i + rowSpan - 1; k++) {
                            let nextRow = trs[k];

                            if (nextRow) {
                                let cs: number = domData.get(trs[k], 'fixed_counts') || 0;

                                domData.set(nextRow, 'fixed_counts', cs + colSpan);
                            }
                        }
                    }

                    ctd.className = td.className;
                    if (td && fc <= fixedColumn) {
                        ctd.classList.add('fx-hidden');
                        td.parentElement!.replaceChild(ctd, td);

                        row.appendChild(td);

                        domData.set(tr, 'delete_cell' + i, ctd);
                        domData.set(tr, 'restore_cell' + i, td);
                    }
                });

                ftds.push(row);
            });

            if (fixedColumn) {
                initTableContent(ftds, CONTENT_TYPE.FIXED_BODY);
            }
        }

        if (tables.foot) {
            let ftrs: HTMLTableRowElement[] = [],
                strs: HTMLTableRowElement[] = [],
                trs: HTMLTableRowElement[] = [].slice.call(tables.foot.querySelectorAll('tr'));

            trs.forEach((tr: HTMLTableRowElement) => {
                let fc: number = domData.get(tr, 'fixed_counts') || 0,
                    frow = document.createElement('tr'),
                    srow = document.createElement('tr');

                [].slice.call(tr.querySelectorAll('th')).forEach((oth: HTMLTableHeaderCellElement, i: number) => {
                    let cth = document.createElement('th'),
                        colSpan = oth.colSpan || 1,
                        rowSpan = oth.rowSpan || 1;

                    fc += colSpan;

                    if (rowSpan > 1) {
                        for (let k = i + 1; k <= i + rowSpan - 1; k++) {
                            let nextRow = trs[k];

                            if (nextRow) {
                                let cs: number = domData.get(trs[k], 'fixed_counts') || 0;

                                domData.set(nextRow, 'fixed_counts', cs + colSpan);
                            }
                        }
                    }

                    cth.className = oth.className;
                    oth.parentElement!.replaceChild(cth, oth);

                    if (fc <= fixedColumn) {
                        let hth = oth.cloneNode() as HTMLTableHeaderCellElement;

                        hth.removeAttribute('data-bind');
                        hth.innerHTML = '&nbsp;';
                        hth.className = oth.className;

                        if (!hth.className) {
                            hth.className = 'fx-hidden';
                        } else {
                            hth.classList.add('fx-hidden');
                        }

                        frow.appendChild(oth);
                        srow.appendChild(hth);
                    } else {
                        let hth = oth.cloneNode() as HTMLTableHeaderCellElement;

                        hth.removeAttribute('data-bind');
                        hth.innerHTML = '&nbsp;';
                        hth.className = oth.className;

                        if (!hth.className) {
                            hth.className = 'fx-hidden';
                        } else {
                            hth.classList.add('fx-hidden');
                        }

                        frow.appendChild(hth);
                        srow.appendChild(oth);
                    }

                    domData.set(tr, 'delete_cell' + i, cth);
                    domData.set(tr, 'restore_cell' + i, oth);
                });

                ftrs.push(frow);
                strs.push(srow);
            });

            if (fixedColumn) {
                initTableContent(ftrs, CONTENT_TYPE.FIXED_FOOT);
            }

            initTableContent(strs, CONTENT_TYPE.SCROLL_FOOT);
        }
    }

    /**
     * 
     * @param tables Main elements of table
     */
    roleBackItem(tables: ITableElement) {
        if (tables.head) {
            [].slice.call(tables.head!.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                [].slice.call(tr.querySelectorAll('th')).forEach((th: any, i: number) => {
                    let d = domData.get(tr, 'delete_cell' + i),
                        r = domData.get(tr, 'restore_cell' + i);

                    if (d && r && d.parentElement == tr) {
                        tr.replaceChild(r, d);
                    }
                });
                // clear old data
                domData.clear(tr);
            });
        }

        if (tables.body) {
            [].slice.call(tables.body.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                [].slice.call(tr.querySelectorAll('td')).forEach((td: any, i: number) => {
                    let d = domData.get(tr, 'delete_cell' + i),
                        r = domData.get(tr, 'restore_cell' + i);

                    if (d && r && d.parentElement == tr) {
                        tr.replaceChild(r, d);
                    }
                });
                // clear old data
                domData.clear(tr);
            });
        }

        if (tables.foot) {
            [].slice.call(tables.foot.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => {
                [].slice.call(tr.querySelectorAll('th')).forEach((th: any, i: number) => {
                    let d = domData.get(tr, 'delete_cell' + i),
                        r = domData.get(tr, 'restore_cell' + i);

                    if (d && r && d.parentElement == tr) {
                        tr.replaceChild(r, d);
                    }
                });
                // clear old data
                domData.clear(tr);
            });
        }
    }

    getRowHeight(tables: ITableElement) {
        let self = this,
            row = tables.body!.querySelector('tr') || tables.head!.querySelector('tr') || tables.foot!.querySelector('tr');

        if (!self.options.rowHeight) {
            if (!row) {
                self.options.rowHeight = 30;
            } else {
                self.options.rowHeight = row.offsetHeight;
            }
        }
    }

    getBorder(element: HTMLElement): {
        x: number;
        y: number;
    } {
        let borders = {
            x: 0,
            y: 0
        }, overflow = element.style.overflow,
            overflowX = element.style.overflowX,
            overflowY = element.style.overflowY;

        element.style.overflow = 'hidden';
        element.style.overflowX = 'hidden';
        element.style.overflowY = 'hidden';

        borders.x = element.offsetWidth - element.clientWidth;
        borders.y = element.offsetHeight - element.clientHeight;

        element.style.overflow = overflow || null;
        element.style.overflowX = overflowX || null;
        element.style.overflowY = overflowY || null;

        return borders;
    }

    getScroll(elements: IElements): {
        x: number;
        y: number;
        default: number;
    } {
        let self = this,
            scroll = { x: 0, y: 0, default: 0 },
            container = self.container,
            body = elements.body.scrollable,
            classList = container.classList,
            overflowY = body.style.overflowY;

        body.style.overflowY = 'scroll';
        scroll.default = body.offsetWidth - body.clientWidth;
        body.style.overflowY = overflowY || null;

        if (classList.contains('has-scroll-y')) {
            if (classList.contains('has-scroll-x')) {
                scroll.y = body.offsetWidth - body.clientWidth;
                scroll.x = body.offsetHeight - body.clientHeight;
            } else {
                scroll.y = body.offsetWidth - body.clientWidth;
            }
        } else if (classList.contains('has-scroll-x')) {
            if (classList.contains('has-scroll-y')) {
                scroll.y = body.offsetWidth - body.clientWidth;
                scroll.x = body.offsetHeight - body.clientHeight;
            } else {
                scroll.x = body.offsetHeight - body.clientHeight;
            }
        }

        return scroll;
    }

    get elements(): IElements {
        let self = this,
            container = self.container,
            // head
            hrow = container.querySelector('.fx-row-header') as HTMLDivElement,
            hfixed = container.querySelector('.fx-fixed-header') as HTMLDivElement,
            hscroll = container.querySelector('.fx-scroll-header') as HTMLDivElement,
            // body
            brow = container.querySelector('.fx-row-body') as HTMLDivElement,
            bfixed = container.querySelector('.fx-fixed-body') as HTMLDivElement,
            bscroll = container.querySelector('.fx-scroll-body') as HTMLDivElement,
            // foot
            frow = container.querySelector('.fx-row-footer') as HTMLDivElement,
            ffixed = container.querySelector('.fx-fixed-footer') as HTMLDivElement,
            fscroll = container.querySelector('.fx-scroll-footer') as HTMLDivElement,
            // table
            ttbl = bscroll.querySelector('table') as HTMLTableElement,
            thead = bscroll.querySelector('thead'),
            tbody = bscroll.querySelector('tbody'),
            tfoot = bscroll.querySelector('tfoot');

        return {
            head: {
                row: hrow,
                fixed: hfixed,
                scrollable: hscroll
            },
            body: {
                row: brow,
                fixed: bfixed,
                scrollable: bscroll
            },
            foot: {
                row: frow,
                fixed: ffixed,
                scrollable: fscroll
            },
            tables: {
                table: ttbl,
                head: thead,
                body: tbody,
                foot: tfoot
            }
        };
    }

    /**
     * Init all elements of fixed table layout
     */
    createElements() {
        let self = this,
            // other elements
            cf = document.createElement('div'),
            table = document.createElement('table'),
            // main container
            container = document.createElement('div'),
            // header elements
            rowHeader = document.createElement('div'),
            fixedHeader = document.createElement('div'),
            scrollHeader = document.createElement('div'),
            // body elements
            rowBody = document.createElement('div'),
            fixedBody = document.createElement('div'),
            scrollBody = document.createElement('div'),
            // footer elements
            fixedFooter = document.createElement('div'),
            scrollFooter = document.createElement('div'),
            rowFooter = document.createElement('div');

        cf.className = 'fx-clear';
        container.className = 'fx-container';

        rowHeader.className = 'fx-row-header';
        rowBody.className = 'fx-row-body';
        rowFooter.className = 'fx-row-footer';

        fixedHeader.className = 'fx-fixed-header';
        scrollHeader.className = 'fx-scroll-header';

        fixedBody.className = 'fx-fixed-body';
        scrollBody.className = 'fx-scroll-body';

        fixedFooter.className = 'fx-fixed-footer';
        scrollFooter.className = 'fx-scroll-footer';

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

        // init default table (prevent exception)
        scrollBody.appendChild(table);

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
            if (container.classList.contains('has-footer')) {
                scrollBody.scrollLeft = scrollFooter.scrollLeft;
                scrollHeader.scrollLeft = scrollFooter.scrollLeft;
            }
            // cancel all scroll event of parents
            evt.preventDefault();
        });

        ko.utils.registerEventHandler(container, 'wheel', (evt: WheelEvent) => {
            let cls = container.classList,
                step = evt.deltaY ? 125 : 40,
                wheel = (evt.deltaY || evt.wheelDeltaY),
                scrollY = cls.contains('has-scroll-y');

            if (evt.shiftKey || !scrollY) {
                if (cls.contains('has-scroll-x')) {
                    if (wheel > 0) {
                        scrollBody.scrollLeft += step;
                    } else {
                        scrollBody.scrollLeft -= step;
                    }
                }
            } else {
                if (cls.contains('has-scroll-y')) {
                    if (wheel > 0) {
                        scrollBody.scrollTop += step;
                    } else {
                        scrollBody.scrollTop -= step;
                    }
                }
            }

            // cancel all scroll event of parents
            evt.preventDefault();
        });

        // set container to self
        self.container = container;
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

interface IElements {
    head: IBlockElement;
    body: IBlockElement;
    foot: IBlockElement;
    tables: ITableElement;
}

interface IBlockElement {
    row: HTMLDivElement;
    fixed: HTMLDivElement;
    scrollable: HTMLDivElement;
}

interface ITableElement {
    table: HTMLTableElement;
    head: HTMLTableSectionElement | null;
    body: HTMLTableSectionElement | null;
    foot: HTMLTableSectionElement | null;
}

interface IOptions {
    width: number;
    displayRow: number;
    fixedColumn: number;
    rowHeight: number;
    columns: number[];
}