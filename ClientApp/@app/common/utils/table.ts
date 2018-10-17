import { $ } from '@app/providers';

export class FixedTable {
    thead: HTMLTableSectionElement | null = null;
    tbody: HTMLTableSectionElement | null = null;

    constructor(private container?: HTMLElement) {
        let self = this,
            resizeTimeout: number | null;

        if (!container) { return; }

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

        // Fix thead and first column on scroll
        container.addEventListener('scroll', function (evt: Event) {
            let hTransform = 'translate3d(0, ' + evt.srcElement!.scrollTop + 'px, 0)',
                fTransform = 'translate3d(' + evt.srcElement!.scrollLeft + 'px, 0, 0)';

            self.thead!.style.transform = hTransform;

            self.thead!.querySelector('th')!.style.transform = fTransform;
            [].slice.call(self.tbody!.querySelectorAll('tr>td:first-child'))
                .forEach(function (td: HTMLTableDataCellElement) {
                    td.style.transform = fTransform;
                });
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
        self.thead!.style.width = totalWidth - thStyles[0].boundingWidth + 'px';

        // Position thead
        self.thead!.style.position = 'absolute';
        self.thead!.style.top = '0';
        self.thead!.style.left = thStyles[0].boundingWidth + 'px';
        self.thead!.style.zIndex = '10';

        // Set widths of the th elements in thead. For the fixed th, set its position
        ths.forEach(function (th, i) {
            th.style.width = thStyles[i].width + 'px';

            if (th.className) {
                th.classList.add('header-fixed-cell');
            } else {
                th.className = "header-fixed-cell";
            }

            if (i === 0) {
                th.style.position = 'absolute';
                th.style.top = '0';
                th.style.left = -thStyles[0].boundingWidth + 'px';
            }
        });

        // Set margin-top for tbody - the fixed header is displayed in this margin
        self.tbody!.style.marginTop = thStyles[0].boundingHeight + 'px';

        // Set widths of the td elements in tbody. For the fixed td, set its position
        tbrs.forEach(function (tr: HTMLTableRowElement, i: number) {
            tr.style.display = 'block';
            tr.style.paddingLeft = thStyles[0].boundingWidth + 'px';

            tr.setAttribute('rid', `${i}`);

            [].slice.call(tr.querySelectorAll('td'))
                .forEach(function (td: HTMLTableDataCellElement, j: number) {
                    td.setAttribute('cid', `${j}`);
                    td.style.width = thStyles[j].width + 'px';

                    if (j === 0) {
                        td.style.position = 'absolute';
                        if (td.className) {
                            td.classList.add('body-fixed-cell');
                        } else {
                            td.className = "body-fixed-cell";
                        }
                        td.style.left = '0';
                    }
                });
        });
    }
}

export { FixedTable as fxtable };