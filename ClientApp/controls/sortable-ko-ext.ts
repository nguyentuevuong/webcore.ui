import * as ko from 'knockout';
import * as $ from 'jquery';
import 'jqueryui';

import { handler } from '../decorator/binding';

@handler({
    virtual: true,
    bindingName: 'sortable'
})

export class SortableBindingHandler implements KnockoutBindingHandler {
    ITEMKEY = "ko_sortItem";
    INDEXKEY = "ko_sourceIndex";
    LISTKEY = "ko_sortList";
    PARENTKEY = "ko_parentList";
    DRAGKEY = "ko_dragItem";
    dataSet = ko.utils.domData.set;
    dataGet = ko.utils.domData.get;
    version = $.ui && $.ui.version;
    hasNestedSortableFix = () => { return this.version && this.version.indexOf("1.6.") && this.version.indexOf("1.7.") && (this.version.indexOf("1.8.") || this.version === "1.8.24") };

    constructor() { }

    addMetaDataAfterRender = (elements: any, data: any) => {
        let self = this;
        ko.utils.arrayForEach(elements, function (element: any) {
            if (element.nodeType === 1) {
                self.dataSet(element, self.ITEMKEY, data);
                self.dataSet(element, self.PARENTKEY, self.dataGet(element.parentNode, self.LISTKEY));
            }
        });
    }

    updateIndexFromDestroyedItems = (index: any, items: any) => {
        let self = this,
            unwrapped = ko.unwrap(items);

        if (unwrapped) {
            for (var i = 0; i < index; i++) {
                //add one for every destroyed item we find before the targetIndex in the target array
                if (unwrapped[i] && ko.unwrap(unwrapped[i]._destroy)) {
                    index++;
                }
            }
        }

        return index;
    }

    stripTemplateWhitespace = (element: any, name: any) => {
        let self = this,
            templateSource,
            templateElement;

        //process named templates
        if (name) {
            templateElement = document.getElementById(name);
            if (templateElement) {
                templateSource = new ko.templateSources.domElement(templateElement);
                templateSource.text($.trim(templateSource.text()));
            }
        }
        else {
            //remove leading/trailing non-elements from anonymous templates
            $(element).contents().each(function () {
                if (this && this.nodeType !== 1) {
                    element.removeChild(this);
                }
            });
        }
    }

    prepareTemplateOptions = (valueAccessor: any, dataName: any) => {
        let self = this,
            result: any = {},
            options: any = ko.unwrap(valueAccessor()) || {},
            actualAfterRender: any;

        //build our options to pass to the template engine
        if (options.data) {
            result[dataName] = options.data;
            result.name = options.template;
        } else {
            result[dataName] = valueAccessor();
        }

        ko.utils.arrayForEach(["afterAdd", "afterRender", "as", "beforeRemove", "includeDestroyed", "templateEngine", "templateOptions", "nodes"], function (option) {
            if (options.hasOwnProperty(option)) {
                result[option] = options[option];
            } else if (ko.bindingHandlers['sortable'].hasOwnProperty(option)) {
                result[option] = ko.bindingHandlers['sortable'][option];
            }
        });

        //use an afterRender function to add meta-data
        if (dataName === "foreach") {
            if (result.afterRender) {
                //wrap the existing function, if it was passed
                actualAfterRender = result.afterRender;
                result.afterRender = function (element: any, data: any) {
                    self.addMetaDataAfterRender.call(data, element, data);
                    actualAfterRender.call(data, element, data);
                };
            } else {
                result.afterRender = self.addMetaDataAfterRender;
            }
        }

        //return options to pass to the template binding
        return result;
    }

    init = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let self = this,
            $element = $(element),
            value = ko.unwrap(valueAccessor()) || {},
            templateOptions = self.prepareTemplateOptions(valueAccessor, "foreach"),
            sortable: any = {},
            startActual: any, updateActual: any;

        self.stripTemplateWhitespace(element, templateOptions.name);

        //build a new object that has the global options with overrides from the binding
        $.extend(true, sortable, ko.bindingHandlers['sortable']);

        if (value.options && sortable.options) {
            ko.utils.extend(sortable.options, value.options);
            delete value.options;
        }
        else {
            sortable.options = sortable.options || {};
            ko.utils.extend(sortable.options, {
                start: () => { },
                update: () => { }
            });
        }

        ko.utils.extend(sortable, value);
        //if allowDrop is an observable or a function, then execute it in a computed observable
        if (sortable.connectClass && (ko.isObservable(sortable.allowDrop) || typeof sortable.allowDrop == "function")) {
            ko.computed({
                read: function () {
                    var value = ko.unwrap(sortable.allowDrop),
                        shouldAdd = typeof value == "function" ? value.call(this, templateOptions.foreach) : value;
                    ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, shouldAdd);
                },
                disposeWhenNodeIsRemoved: element
            }, this);
        } else {
            ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, sortable.allowDrop);
        }

        //wrap the template binding
        if (ko.bindingHandlers.template.init) {
            ko.bindingHandlers.template.init(element, function () {
                return templateOptions;
            }, allBindingsAccessor, viewModel, bindingContext);
        }
        //keep a reference to start/update functions that might have been passed in
        startActual = sortable.options.start;
        updateActual = sortable.options.update;
        //ensure draggable table row cells maintain their width while dragging (unless a helper is provided)
        if (!sortable.options.helper) {
            sortable.options.helper = function (e: JQueryEventObject, ui: JQuery<Element>) {
                if (ui.is("tr")) {
                    ui.children().each(function () {
                        $(this).width(this.clientWidth);
                    });
                }
                return ui;
            };
        }
        //initialize sortable binding after template binding has rendered in update function
        var createTimeout = setTimeout(function () {
            var dragItem: any;
            var originalReceive = sortable.options.receive;
            $element.sortable(ko.utils.extend(sortable.options, {
                start: function (event: any, ui: any) {
                    //track original index
                    var el = ui.item[0];
                    self.dataSet(el, self.INDEXKEY, ko.utils.arrayIndexOf(ui.item.parent().children(), el));
                    //make sure that fields have a chance to update model
                    ui.item.find("input:focus").change();
                    if (startActual) {
                        startActual.apply(this, arguments);
                    }
                },
                receive: function (event: any, ui: any) {
                    //optionally apply an existing receive handler
                    if (typeof originalReceive === "function") {
                        originalReceive.call(this, event, ui);
                    }
                    dragItem = self.dataGet(ui.item[0], self.DRAGKEY);
                    if (dragItem) {
                        //copy the model item, if a clone option is provided
                        if (dragItem.clone) {
                            dragItem = dragItem.clone();
                        }
                        //configure a handler to potentially manipulate item before drop
                        if (sortable.dragged) {
                            dragItem = sortable.dragged.call(this, dragItem, event, ui) || dragItem;
                        }
                    }
                },
                update: function (event: any, ui: any) {
                    var sourceParent, targetParent, sourceIndex, targetIndex, arg,
                        el = ui.item[0],
                        parentEl = ui.item.parent()[0],
                        item = self.dataGet(el, self.ITEMKEY) || dragItem;
                    if (!item) {
                        $(el).remove();
                    }
                    dragItem = null;
                    //make sure that moves only run once, as update fires on multiple containers
                    if (item && ($element[0] === parentEl) || (!self.hasNestedSortableFix && $.contains(<any>this, parentEl))) {
                        //identify parents
                        sourceParent = self.dataGet(el, self.PARENTKEY);
                        sourceIndex = self.dataGet(el, self.INDEXKEY);
                        targetParent = self.dataGet(el.parentNode, self.LISTKEY);
                        targetIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), el);
                        //take destroyed items into consideration
                        if (!templateOptions.includeDestroyed) {
                            sourceIndex = self.updateIndexFromDestroyedItems(sourceIndex, sourceParent);
                            targetIndex = self.updateIndexFromDestroyedItems(targetIndex, targetParent);
                        }
                        //build up args for the callbacks
                        if (sortable.beforeMove || sortable.afterMove) {
                            arg = {
                                item: item,
                                sourceParent: sourceParent,
                                sourceParentNode: sourceParent && ui.sender || el.parentNode,
                                sourceIndex: sourceIndex,
                                targetParent: targetParent,
                                targetIndex: targetIndex,
                                cancelDrop: false
                            };
                            //execute the configured callback prior to actually moving items
                            if (sortable.beforeMove) {
                                sortable.beforeMove.call(this, arg, event, ui);
                            }
                        }
                        //call cancel on the correct list, so KO can take care of DOM manipulation
                        if (sourceParent) {
                            $(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
                        }
                        //for a draggable item just remove the element
                        else {
                            $(el).remove();
                        }
                        //if beforeMove told us to cancel, then we are done
                        if (arg && arg.cancelDrop) {
                            return;
                        }
                        //if the strategy option is unset or false, employ the order strategy involving removal and insertion of items
                        if (!sortable.hasOwnProperty("strategyMove") || sortable.strategyMove === false) {
                            //do the actual move
                            if (targetIndex >= 0) {
                                if (sourceParent) {
                                    sourceParent.splice(sourceIndex, 1);
                                    //if using deferred updates plugin, force updates
                                    if ((<any>ko)['processAllDeferredBindingUpdates']) {
                                        (<any>ko)['processAllDeferredBindingUpdates']();
                                    }
                                    //if using deferred updates on knockout 3.4, force updates
                                    if (ko.options && ko.options.deferUpdates) {
                                        ko.tasks.runEarly();
                                    }
                                }
                                targetParent.splice(targetIndex, 0, item);
                            }
                            //rendering is handled by manipulating the observableArray; ignore dropped element
                            self.dataSet(el, self.ITEMKEY, null);
                        } else { //employ the strategy of moving items
                            if (targetIndex >= 0) {
                                if (sourceParent) {
                                    if (sourceParent !== targetParent) {
                                        // moving from one list to another
                                        sourceParent.splice(sourceIndex, 1);
                                        targetParent.splice(targetIndex, 0, item);
                                        //rendering is handled by manipulating the observableArray; ignore dropped element
                                        self.dataSet(el, self.ITEMKEY, null);
                                        ui.item.remove();
                                    } else {
                                        // moving within same list
                                        var underlyingList = ko.unwrap(sourceParent);
                                        // notify 'beforeChange' subscribers
                                        if (sourceParent.valueWillMutate) {
                                            sourceParent.valueWillMutate();
                                        }
                                        // move from source index ...
                                        underlyingList.splice(sourceIndex, 1);
                                        // ... to target index
                                        underlyingList.splice(targetIndex, 0, item);
                                        // notify subscribers
                                        if (sourceParent.valueHasMutated) {
                                            sourceParent.valueHasMutated();
                                        }
                                    }
                                } else {
                                    // drop new element from outside
                                    targetParent.splice(targetIndex, 0, item);
                                    //rendering is handled by manipulating the observableArray; ignore dropped element
                                    self.dataSet(el, self.ITEMKEY, null);
                                    ui.item.remove();
                                }
                            }
                        }
                        //if using deferred updates plugin, force updates
                        if ((<any>ko)['processAllDeferredBindingUpdates']) {
                            (<any>ko)['processAllDeferredBindingUpdates']();
                        }
                        //allow binding to accept a function to execute after moving the item
                        if (sortable.afterMove) {
                            sortable.afterMove.call(this, arg, event, ui);
                        }
                    }
                    if (updateActual) {
                        updateActual.apply(this, arguments);
                    }
                },
                connectWith: false
            }));
            //handle enabling/disabling sorting
            if (sortable.isEnabled !== undefined) {
                ko.computed({
                    read: function () {
                        $element.sortable(ko.unwrap(sortable.isEnabled) ? "enable" : "disable");
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }
        }, 0);
        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //only call destroy if sortable has been created
            if ($element.data("ui-sortable") || $element.data("sortable")) {
                $element.sortable("destroy");
            }
            ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, false);
            //do not create the sortable if the element has been removed from DOM
            clearTimeout(createTimeout);
        });
        return {
            'controlsDescendantBindings': true
        };
    }

    update = (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, viewModel: any, bindingContext: KnockoutBindingContext) => {
        let self = this,
            templateOptions = self.prepareTemplateOptions(valueAccessor, "foreach");
        //attach meta-data
        self.dataSet(element, self.LISTKEY, templateOptions.foreach);
        //call template binding's update with correct options
        ko.bindingHandlers.template.update!(element, function () { return templateOptions; }, allBindingsAccessor, viewModel, bindingContext);
    }
}