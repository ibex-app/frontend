import * as TE from 'fp-ts/lib/TaskEither';
import * as E from "fp-ts/lib/Either";
import { pipe } from 'fp-ts/lib/function';
import { formatDate } from './Utils';
// import { setGlobalState, useGlobalState } from '../app/store';
import * as T from 'fp-ts/Task'
import { useNavigate } from "react-router-dom";

export type Response<T> = E.Either<Error, T>;
export type PromiseResponse<T> = Promise<Response<T>>;



export const get: any = async (path: string, params: Object) => {
    // const [user, setUser] = useGlobalState('user');
    
    const token = window.localStorage.getItem('jwt')
    let headers: any
    if(token){
         headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        })
    } else {
         headers = new Headers({
            'Content-Type': 'application/json',
        })
    }
    const logout = () => {
        window.localStorage.removeItem('jwt')
        const navigate = useNavigate();
        navigate("/frontend/login");
        const kkk:any = {}
        return T.of(kkk);
    }

    return pipe(
        TE.tryCatch(
            () => fetch(`https://ibex-app.com/${path}`, {
                method: 'post',
                headers: headers,
                body: JSON.stringify(params),
            }).then((res:any) => {
                    if(res.status === 401){
                        logout()
                    }
                    return res.json()
                }), 
                (reason) => new Error(`${reason}`)
        ),
        // TE.getOrElse(useError),
        TE.map((resp) => resp)
    )()
};


export const transform_filters_to_request = (filters_: any) => {
    let filters = JSON.parse(JSON.stringify(filters_));

    if (filters.time_interval_from && filters.time_interval_to) {
        filters.time_interval_from = formatDate(filters.time_interval_from);
        filters.time_interval_to = formatDate(filters.time_interval_to);
        filters.platform = filters.platform.map((a: any) => a._id || a)
        filters.author_platform_id = filters.author_platform_id.map((a: any) => a._id)
        filters.locations = filters.locations.map((a: any) => a._id)
        filters.persons = filters.persons.map((a: any) => a._id)
    }
    return filters
}