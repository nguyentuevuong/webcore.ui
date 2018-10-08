import * as ko from 'knockout';
import { handler } from '@app/common/ko';

@handler({
    virtual: true,
    bindingName: 'switch'
})
export class SwitchBindingHandler implements KnockoutBindingHandler {
    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let contexts: Array<any> = [],
            switchSkipNextArray: Array<any> = [],
            switchBindings: any = {
                // these properties are public
                $else: {},
                $default: {},
                $switchDefault: ko.observable(true),
                $switchValueAccessor: valueAccessor,
                // these properties are internal
                $switchSkipNextArray: switchSkipNextArray
            },
            // Each child element gets a new binding context so it can set its own $switchIndex property.
            // The other properties will be shared since they're objects.
            node: KnockoutVirtualElement, nextInQueue: KnockoutVirtualElement = ko.virtualElements.firstChild(element);

        // Update $value in each context when it changes
        ko.computed(() => {
            ko.utils.extend(switchBindings, {
                $value: ko.unwrap(valueAccessor())
            });

            ko.utils.arrayForEach(contexts, context => {
                context.$value = switchBindings.$value;
            });
        }, null, { disposeWhenNodeIsRemoved: element });

        while (node = nextInQueue) {
            nextInQueue = ko.virtualElements.nextSibling(node);

            switch ((<any>node).nodeType) {
                case 1:
                case 8:
                    let newContext = bindingContext.extend(switchBindings);

                    // Set initial value of context.$switchIndex to undefined
                    newContext.$switchIndex = undefined;

                    ko.applyBindings(newContext, node);

                    // Add the context to the list to be updated if this section contained a case binding
                    if (newContext.$switchIndex !== undefined) {
                        contexts.push(newContext);
                    }

                    break;
            }
        }

        return { controlsDescendantBindings: true };
    }
}

const checkCase = (value: any, bindingContext: KnockoutBindingContext) => {
    // Check value and determine result:
    //  If the control value is boolean, the result is the matching truthiness of the value
    //  If value is boolean, the result is the value (allows expressions instead of just simple matching)
    //  If value is an array, the result is true if the control value matches (strict) an item in the array
    //  Otherwise, the result is true if value matches the control value (loose)
    let switchValue = ko.unwrap((<any>bindingContext).$switchValueAccessor());

    return (typeof switchValue == 'boolean')
        ? (value ? switchValue : !switchValue) : (typeof value == 'boolean')
            ? value : (value instanceof Array)
                ? (ko.utils.arrayIndexOf(value, switchValue) !== -1) : (value == switchValue);
},
    checkNotCase = (value: any, bindingContext: KnockoutBindingContext) => !checkCase(value, bindingContext),
    makeCaseHandler = (binding: string, isNot?: boolean) => {
        let checkFunction = isNot ? checkNotCase : checkCase;

        binding || (binding = 'if');

        return {
            // Inherit flags from the binding we're wrapping
            flags: ko.bindingHandlers[binding].flags,

            init: function (element: HTMLElement, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
                if (!(<any>bindingContext).$switchSkipNextArray) {
                    throw Error("case binding must only be used with a switch binding");
                }

                if ((<any>bindingContext).$switchIndex !== undefined) {
                    throw Error("case binding cannot be nested");
                }

                // Initialize $switchIndex and push a new observable to $switchSkipNextArray
                (<any>bindingContext).$switchIndex = (<any>bindingContext).$switchSkipNextArray.push(ko.observable(false)) - 1;

                (<any>bindingContext).$caseValue = ko.observable();

                ko.computed(function () {
                    let result,
                        skipNext,
                        noDefault,
                        index = (<any>bindingContext).$switchIndex,
                        isLast = (index === (<any>bindingContext).$switchSkipNextArray.length - 1);

                    if (index && (<any>bindingContext).$switchSkipNextArray[index - 1]()) {
                        // An earlier case binding matched: skip this one (and subsequent ones)
                        result = false;
                        skipNext = true;
                    } else {
                        let value = ko.unwrap(valueAccessor());

                        if (value === (<any>bindingContext).$else || value == (<any>bindingContext).$default) {
                            // If value is the special object $else, the result depends on the other case values.
                            // If we're the last *case* item, the value must be true. $switchDefault will get
                            // updated to *true* below, but that won't necessarily update us because it would
                            // require a recursive update.
                            result = (<any>bindingContext).$switchDefault() || isLast;
                            skipNext = false;
                        } else {
                            // If result is true, we will skip the subsequent cases (and any default cases)
                            noDefault = skipNext = result = checkFunction(value, bindingContext);
                        }
                    }

                    // Set the observable used by the wrapped binding function
                    (<any>bindingContext).$caseValue(result);

                    // Update the observable "skip next" value; if the value is changed, this will update the
                    // subsequent case item.
                    (<any>bindingContext).$switchSkipNextArray[index](skipNext);

                    // Update $switchDefault to false if a non-default case item has matched.
                    // Update it to true if we're the last item and none of items have matched.
                    // (Initially, every item will be the last, but it doesn't matter.)
                    if (noDefault) {
                        (<any>bindingContext).$switchDefault(false);
                    }
                    else if (!skipNext && isLast) {
                        (<any>bindingContext).$switchDefault(true);
                    }
                }, null, { disposeWhenNodeIsRemoved: element });

                // Call init with the observable result value
                if (ko.bindingHandlers[binding].init) {
                    return ko.bindingHandlers[binding].init!(element, () => (<any>bindingContext).$caseValue, allBindings, viewModel, bindingContext);
                }
            },

            update: function (element: HTMLElement, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: KnockoutBindingContext) {
                // Call update with the observable result value
                if (ko.bindingHandlers[binding].update) {
                    return ko.bindingHandlers[binding].update!(element, () => (<any>bindingContext).$caseValue, allBindings, viewModel, bindingContext);
                }
            }
        };
    },
    // Support dynamically creating new case binding when using Punches plugin
    getNamespacedHandler = (bindingName: string, namespace: string, bindingKey: string) => {
        if (ko.virtualElements.allowedBindings[bindingName]) {
            ko.virtualElements.allowedBindings[bindingKey] = true;
        }

        return makeCaseHandler(bindingName, namespace === 'casenot');
    },
    // Support dynamically creating new case binding when using key.subkey plugin
    makeSubkeyHandler = (baseKey: string, subKey: string, bindingKey: string) => {
        return getNamespacedHandler(subKey, baseKey, bindingKey);
    },
    makeBaseHandler = (name: string, isNot?: boolean) => {
        ko.virtualElements.allowedBindings[name] = true;

        ko.bindingHandlers[name] = makeCaseHandler('if', isNot);
        ko.bindingHandlers[name].makeSubkeyHandler = makeSubkeyHandler;
        ko.bindingHandlers[name].getNamespacedHandler = getNamespacedHandler;
    };

makeBaseHandler('case');
makeBaseHandler('casenot', true /*isNot*/);

ko.bindingHandlers['case.visible'] = makeCaseHandler('visible');
ko.bindingHandlers['casenot.visible'] = makeCaseHandler('visible', true /*isNot*/);

ko.virtualElements.allowedBindings.switch = true;
ko.bindingHandlers['switch'].makeCaseHandler = makeCaseHandler;