import { ko } from '@app/providers';

export class FixedTable {
    options: {
        width: number;
        displayRow: number;
        fixedColumn: number;
    } = {
            width: 400,
            displayRow: 10,
            fixedColumn: 0
        };
    scrollStep: number = 40;
    thead: HTMLTableSectionElement | null = null;
    tbody: HTMLTableSectionElement | null = null;

    constructor(private container?: HTMLElement, options?: { width: number; displayRow: number; fixedColumn: number; }) {
        let self = this,
            resizeTimeout: number | null,
            ie = !!navigator.userAgent.match(/(MSIE |Trident.*rv[ :])([0-9]+)/);

        if (!container) { return; }

        options = options || self.options;
        ko.utils.extend(self.options, options);

        container.style.overflow = 'auto';
        container.style.position = 'relative';

        self.thead = container.querySelector('thead');
        self.tbody = container.querySelector('tbody');

        if (!self.thead || !self.tbody) { return; }

        self.relayout();

        // Update table cell dimensions on resize
        window.addEventListener('resize', function () {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    self.relayout();
                }, 500);
            }
        }, false);

        container.addEventListener('wheel', function (evt: WheelEvent) {
            if (!ie) {
                if (!evt.shiftKey) {
                    if (evt.wheelDeltaY > 0) {
                        container.scrollTop += self.scrollStep;
                    } else {
                        container.scrollTop -= self.scrollStep;
                    }
                } else {
                    if (evt.wheelDeltaY > 0) {
                        container.scrollLeft += self.scrollStep;
                    } else {
                        container.scrollLeft -= self.scrollStep;
                    }
                }

                evt.preventDefault();
            }
        });

        // Fix thead and first column on scroll
        container.addEventListener('scroll', function (evt: Event) {
            let hTransform = 'translate3d(0, ' + evt.srcElement!.scrollTop + 'px, 0)',
                fTransform = 'translate3d(' + evt.srcElement!.scrollLeft + 'px, 0, 0)';

            self.thead!.style.transform = hTransform;

            if (self.options.fixedColumn) {
                self.thead!.querySelector('th')!.style.transform = fTransform;
                [].slice.call(self.tbody!.querySelectorAll('tr>td:first-child'))
                    .forEach(function (td: HTMLTableDataCellElement) {
                        td.style.transform = fTransform;
                    });
            }

            evt.preventDefault();
        });

        self.tbody!.addEventListener('DOMNodeInserted', function () {
            self.relayout();
        });

        self.tbody!.addEventListener('DOMNodeRemoved', function () {
            self.relayout();
        });
    }

    relayout() {
        let self = this,
            thrs: HTMLTableRowElement[] = [].slice.call(self.thead!.querySelectorAll('tr')),
            ths: HTMLTableHeaderCellElement[] = [].slice.call(self.thead!.querySelectorAll('th')),
            tbrs: HTMLTableRowElement[] = [].slice.call(self.tbody!.querySelectorAll('tr'));

        self.tbody!.setAttribute('style', '');
        self.thead!.setAttribute('style', '');

        thrs.forEach(function (tr: HTMLTableRowElement) {
            tr.setAttribute('style', '');
            [].slice.call(tr.querySelectorAll('th'))
                .forEach(function (th: HTMLTableHeaderCellElement) {
                    th.setAttribute('style', '');
                });
        });

        tbrs.forEach(function (tr: HTMLTableRowElement) {
            tr.setAttribute('style', '');
            [].slice.call(tr.querySelectorAll('th'))
                .forEach(function (td: HTMLTableDataCellElement) {
                    td.setAttribute('style', '');
                });
        });

        if (!tbrs[0]) {
            self.container!.style.maxHeight = (20 * self.options.displayRow + self.thead!.getBoundingClientRect().height) + 'px';
        } else {
            self.container!.style.maxHeight = (tbrs[0].getBoundingClientRect().height * self.options.displayRow + self.thead!.getBoundingClientRect().height + 20) + 'px';
        }

        self.container!.style.width = (self.options.width || self.tbody!.getBoundingClientRect().width + 20) + 'px';

        /**
         * Store width and height of each th
         * getBoundingClientRect()'s dimensions include paddings and borders
         */
        let thStyles = ths.map(function (th) {
            let rect = th.getBoundingClientRect(),
                style = document.defaultView!.getComputedStyle(th, '');

            return {
                boundingWidth: rect.width,
                boundingHeight: rect.height,
                width: parseInt(style.width || '0', 10),
                paddingLeft: parseInt(style.paddingLeft || '0', 10)
            };
        }),// Set widths of thead and tbody
            totalWidth = thStyles.reduce(function (sum, cur) {
                return sum + cur.boundingWidth;
            }, 0);

        self.tbody!.style.display = 'block';
        self.tbody!.style.width = totalWidth + 'px';
        if (self.options.fixedColumn) {
            self.thead!.style.width = totalWidth - thStyles[0].boundingWidth + 'px';
        } else {
            self.thead!.style.width = totalWidth + 'px';
        }

        // Position thead
        self.thead!.style.position = 'absolute';
        self.thead!.style.top = '0';

        if (self.options.fixedColumn) {
            self.thead!.style.left = thStyles[0].boundingWidth + 'px';
        }
        self.thead!.style.zIndex = '10';

        // Set widths of the th elements in thead. For the fixed th, set its position
        ths.forEach(function (th, i) {
            th.style.width = thStyles[i].width + 'px';

            if (th.className) {
                th.classList.add('header-fixed-cell');
            } else {
                th.className = "header-fixed-cell";
            }

            if (self.options.fixedColumn && i === 0) {
                th.style.top = '0';
                th.style.position = 'absolute';
                if (self.options.fixedColumn) {
                    th.style.left = -thStyles[0].boundingWidth + 'px';
                }
            }
        });

        // Set margin-top for tbody - the fixed header is displayed in this margin
        self.tbody!.style.marginTop = thStyles[0].boundingHeight + 'px';

        // Set widths of the td elements in tbody. For the fixed td, set its position
        tbrs.forEach(function (tr: HTMLTableRowElement, i: number) {
            tr.style.display = 'block';
            if (self.options.fixedColumn) {
                tr.style.paddingLeft = thStyles[0].boundingWidth + 'px';
            }

            tr.setAttribute('rid', `${i}`);

            self.scrollStep = tr.getBoundingClientRect().height;

            [].slice.call(tr.querySelectorAll('td'))
                .forEach(function (td: HTMLTableDataCellElement, j: number) {
                    td.setAttribute('cid', `${j}`);
                    td.style.width = thStyles[j].width + 'px';

                    if (self.options.fixedColumn && j === 0) {
                        td.style.left = '0';
                        td.style.position = 'absolute';
                        td.style.height = self.scrollStep + 'px';

                        if (!td.className) {
                            td.className = "body-fixed-cell";
                        } else {
                            td.classList.add('body-fixed-cell');
                        }
                    }
                });
        });
    }
}

export { FixedTable as fxtable };