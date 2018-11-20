import { ko } from '@app/providers';

function hasClass(element: HTMLElement | null, className: string) {
    return element && element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
}

document.addEventListener("click", function (e) {
    let clicked: HTMLElement | null = null;

    // dropdown menu
    ((evt: MouseEvent) => {
        for (let node = evt.target as HTMLElement; node != document.body; node = node.parentNode as HTMLElement) {
            if (node.getAttribute('data-dismiss') == "false") {
                clicked = node;
                break;
            } else if (hasClass(node, 'dropdown') || hasClass(node, 'dropdown-toggle') || node.getAttribute('data-toggle') == "dropdown") {
                clicked = node;
                break;
            }
        }

        if (clicked) {
            [].slice.call(document.querySelectorAll('.dropdown-toggle, [data-toggle="dropdown"]'))
                .forEach((element: HTMLElement) => {
                    let parent = element.parentNode as HTMLElement,
                        dropdown = parent.querySelector('.dropdown-menu') as HTMLElement | null;

                    if (dropdown) {
                        if (clicked == element) {
                            if (!hasClass(dropdown, 'show')) {
                                ko.utils.dom.addClass(dropdown, 'show');
                            } else {
                                ko.utils.dom.removeClass(dropdown, 'show');
                            }
                        } else {
                            if (!clicked || clicked.getAttribute('data-dismiss') != 'false') {
                                ko.utils.dom.removeClass(dropdown, 'show');
                            }
                        }
                    }
                });
        } else {
            [].slice.call(document.querySelectorAll('.dropdown-menu'))
                .forEach((element: HTMLElement) => {
                    ko.utils.dom.removeClass(element, 'show');
                });
        }
    })(e);

    // other event
});
