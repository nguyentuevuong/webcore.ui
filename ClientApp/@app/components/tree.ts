import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'tree',
    template: `
    <ul class="list-group tree-list-group noselect" id="people" data-bind='sortable: { template: "personTmpl", data: dataSources, beforeMove: $vm.beforeMove.bind($vm)}'></ul>
    <script id="personTmpl" type="text/html">
        <li class="list-group-item" data-bind="init: { '$data.$expand': ko.observable(true), hcz: !!_.size(ko.toJS($data.children)), '$data.$checked': ko.observable(false) }">
            <section data-bind="click: $vm.selectItem.bind($vm, $data), css: { active: _.isEqual(ko.toJS($data), ko.toJS($vm.active))}">
                <i class="fa" data-bind="css: { 'fa-folder-o': hcz && !ko.toJS($data.$expand), 'fa-folder-open-o': hcz && ko.toJS($data.$expand), 'fa-file-o': !hcz }, click: function() { $data.$expand(!ko.toJS($data.$expand)); }"></i>
                <i class="fa" data-bind="css: { 'fa-check-square-o': ko.toJS($data.$checked), 'fa-square-o': !ko.toJS($data.$checked) }, click: function() { $data.$checked(!ko.toJS($data.$checked)); }"></i>
                <span data-bind="i18n: name"></span>
            </section>
            <!-- ko if: ko.toJS($data.$expand) -->
            <ul class="list-group" data-bind='sortable: { template: "personTmpl", data: $data.children}'></ul>
            <!-- /ko -->
        </li>
    </script>`
})
export class TreeComponent {
    active: KnockoutObservable<Person | undefined> = ko.observable();

    dataSources: KnockoutObservableArray<Person> = ko.observableArray([
        new Person({
            name: "Bob furry furry furry furry",
            children: [
                { name: "Jan furry furry furry furry" },
                {
                    name: "Don furry furry furry furry",
                    children: [
                        { name: "Ted furry furry furry furry" },
                        {
                            name: "Ben furry furry furry furry",
                            children: [
                                {
                                    name: "Joe furry furry furry furry",
                                    children: [
                                        { name: "Ali furry furry furry furry" },
                                        { name: "Ken furry furry furry furry" }
                                    ]
                                }
                            ]
                        },
                        { name: "Doug furry furry furry furry" }
                    ]
                }
            ]
        }),
        new Person({
            name: "Ann furry furry furry furry",
            children: [
                { name: "Eve furry furry furry furry" },
                { name: "Hal furry furry furry furry" }
            ]
        })
    ]);

    constructor(params: any, element: HTMLElement) {
        let self = this;
    }

    selectItem(item: any) {
        let self = this;
        self.active(item);
    }

    beforeMove(arg: any) {
        let self = this;

        debugger;
    }
}


class Person {
    name: KnockoutObservable<string> = ko.observable('');
    children: KnockoutObservableArray<Person> = ko.observableArray([]);
    constructor(params: IPerson) {
        let self = this;

        self.name(params.name);

        if (params.children) {
            self.children(params.children!.map(m => new Person(m)));
        }
    }
}

interface IPerson {
    name: string;
    children?: Array<IPerson>;
}