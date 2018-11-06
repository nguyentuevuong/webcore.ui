import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler } from '@app/common/ko';

let originalClick = ko.bindingHandlers.click;

@handler({
    virtual: false,
    bindingName: 'click',
    validatable: true
})
export class SafeClickBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let lastPreventTime: number = new Date().getTime(),
            originalFunction = valueAccessor(),
            timeClick: number | undefined = originalFunction.timeClick || ko.toJS(allBindingsAccessor().timeClick),
            newValueAccesssor = function () {
                return function () {
                    let currentPreventTime: number = new Date().getTime(),
                        time: number = currentPreventTime - lastPreventTime;

                    if (time > (timeClick || 500)) {
                        //pass through the arguments
                        originalFunction && originalFunction.apply(viewModel, _.concat([viewModel], arguments));
                    }

                    lastPreventTime = new Date().getTime();
                }
            };
        originalClick.init!(element, newValueAccesssor, allBindingsAccessor, viewModel, bindingContext);
    }
}