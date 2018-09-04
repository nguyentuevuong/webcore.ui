import {component} from "@app/common/ko";

@component({
    url: '/sample/json-viewer',
    icon: 'fa fa-file-code-o',
    title: 'Json viewer',
    template: require('./index.html')
})
export class JsonViewModel {
    public model = {
        id: 1,
        name: 'Nguyen Van Vuong',
        address: 'Me Xa 3 - Nguyen Trai - An Thi - Hung Yen'
    }
}