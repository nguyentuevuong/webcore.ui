import {component} from "../../../common";

@component({
    url: '/sample/json-viewer',
    icon: 'fa fa-file-code-o',
    title: 'Json viewer',
    template: require('./json.html')
})
export class JsonViewModel {
    public model = {
        id: 1,
        name: 'Nguyen Van Vuong',
        address: 'Me Xa 3 - Nguyen Trai - An Thi - Hung Yen'
    }
}