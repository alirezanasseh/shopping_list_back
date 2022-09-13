import {IRole} from './role.interface';
import {IServiceReturn, ISResult} from '../../interfaces';
import {Role} from './role.model';

export async function role_create_service (props: IRole): Promise<IServiceReturn<ISResult>> {
    try {
        const new_role = await Role.create(props);
        if (new_role) {
            return {
                code: 201,
                result: {done: true}
            };
        } else {
            return {
                code: 500,
                error: 'Role could not be created'
            };
        }
    } catch (e) {
        throw e;
    }
}