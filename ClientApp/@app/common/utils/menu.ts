import { _, ko } from '@app/providers';
import { Components, IComponent } from '@app/common/ko';

export class Menu {
    public static get hirachies() {
        let menus: Array<IMenu> = _(Components).filter(f => !_.isUndefined(f.url)).map((m: IComponent, i: number) => ({
            index: i + 1,
            url: m.url || '',
            name: m.name || '',
            icon: m.icon || '',
            title: m.title || '',
            childs: []
        })).value();

        // create group menu
        _.each(menus, (m: IMenu) => {
            let gurl = m.url.split('/');

            if (_.size(gurl) >= 2) {
                _(gurl).take(2).each(m => {
                    //if()
                });
            }
        });

        return _.filter(menus, m => _.isNil(m.parent));
    }
}

export { Menu as menu }

interface IMenu {
    index: number;
    url: string;
    name: string;
    icon: string;
    title: string;
    parent?: IMenu;
    childs?: Array<IMenu>;
}
