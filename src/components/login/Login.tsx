export { }
// import React from 'react';
// import * as TE from 'fp-ts/lib/TaskEither';
// import * as E from 'fp-ts/lib/Either';
// import { Form } from '../form/Form';
// import { FormData } from '../../types/form';
// import LoginData from '../../data/login.json';
// import { Https } from '../../shared/Http';
// import { setGlobalState } from '../../app/store';
// import { AuthResponse, UserInfo } from '../../types/user';

// export function Login() {
//   const login = E.fold(
//     (error: string) => console.log('User not logged in!'),
//     (data: UserInfo) => setGlobalState('user', data)
//   );

//   const submit = async (data: FormData) => {
//     // const res: AuthResponse = await Https.get('/login');

//     // login(res);
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <Form data={LoginData.data} submitter={submit} />
//     </div>
//   );
// }