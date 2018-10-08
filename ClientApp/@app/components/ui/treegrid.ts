import { _, ko } from '@app/providers';
import { component } from "@app/common/ko";

@component({
    name: 'tree-grid',
    template: ``
})
export class TreeGridComponent {
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