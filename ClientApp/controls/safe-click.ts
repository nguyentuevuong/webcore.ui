import * as _ from 'lodash';
import * as ko from 'knockout';

import { handler } from '../decorator/binding';

@handler({
    virtual: false,
    bindingName: 'safeClick'
})
export class SafeClickBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let lastPreventTime: number = new Date().getTime(),
            originalFunction = valueAccessor(),
            newValueAccesssor = function () {
                return function () {
                    let currentPreventTime: number = new Date().getTime(),
                        time: number = currentPreventTime - lastPreventTime;
                        
                    if (time > 500) {
                        //pass through the arguments
                        originalFunction.apply(viewModel, _.concat([viewModel], arguments));
                    }

                    lastPreventTime = new Date().getTime();
                }
            };
        ko.bindingHandlers.click.init!(element, newValueAccesssor, allBindingsAccessor, viewModel, bindingContext);
    }
}