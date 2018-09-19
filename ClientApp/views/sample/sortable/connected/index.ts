import { _, ko } from '@app/providers';
import { component } from '@app/common/ko';

@component({
    url: 'sample/sortable/connected',
    name: 'sample-sortable-connected',
    title: 'Sortable control (connected)',
    icon: 'fa fa-refresh',
    styles: require('./style.css'),
    template: require('./index.html')
})
export class SampleSortableConnectedViewModel {
    highPriorityTasks: KnockoutObservableArray<Task> = ko.observableArray([
        new Task("Get dog food"),
        new Task("Mow lawn"),
        new Task("Fix car")
    ]);
    normalPriorityTasks: KnockoutObservableArray<Task> = ko.observableArray([
        new Task("Fix fence"),
        new Task("Walk dog"),
        new Task("Read book")
    ]);

    trash: KnockoutObservableArray<Task> = ko.observableArray([]);
    selectedTask: KnockoutObservable<Task | undefined> = ko.observable();

    constructor(params: any, private element: HTMLElement) {
        let self = this;

        ko.utils.extend(self.highPriorityTasks, {
            id: 'high'
        });

        ko.utils.extend(self.normalPriorityTasks, {
            id: 'normal'
        });

        ko.utils.extend(self.trash, {
            id: 'trash'
        });
    }

    clearTask(data: Task, event: any) {
        let self = this;

        if (_.isEqual(ko.toJS(data), ko.toJS(self.selectedTask))) {
            self.selectedTask(undefined);
        }

        if (data.name() === "") {
            self.highPriorityTasks.remove(data);
            self.normalPriorityTasks.remove(data);
        }
    };

    isTaskSelected(task: Task) {
        let self = this;

        return task === self.selectedTask();
    };

    addTask() {
        let self = this,
            task = new Task("new");

        self.selectedTask(task);
        self.normalPriorityTasks.push(task);
    };

    myDropCallback(arg: any) {
        if (console) {
            console.log("Moved '" + arg.item.name() + "' from " + arg.sourceParent.id + " (index: " + arg.sourceIndex + ") to " + arg.targetParent.id + " (index " + arg.targetIndex + ")");
        }
    };
}

class Task {
    name: KnockoutObservable<string> = ko.observable('');

    constructor(name: string) {
        let self = this;

        self.name(name || '');
    }
}