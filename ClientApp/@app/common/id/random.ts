import * as _ from 'lodash';

export const randomId = (): string => _(Math.random().toString(36)).slice(2, 33).join('');