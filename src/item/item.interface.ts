import {IList} from '../list';

export interface IItem {
    _id: string;
    list: string | IList;
    title: string;
    description?: string;
    bought: boolean;
}