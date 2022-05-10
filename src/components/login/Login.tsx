// export { }
import React from 'react';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
// import { Form } from '../form/Form';
import { FormData } from '../../types/form';
import LoginData from '../../data/login.json';
// import { Https } from '../../shared/Http';
import { setGlobalState, useGlobalState } from '../../app/store';
import { AuthResponse, UserInfo } from '../../types/user';
import './Login.css';
import { Link } from 'react-router-dom';

export function Login() {
  const subdomain = window.location.href.indexOf('localhost') > -1 ? 'dev' : window.location.href.split('.ibex-app.com/login')[0].split('//')[1]
  const loginUrl = `https://${subdomain}.ibex-app.com/api/login`
  const login = E.fold(
    (error: string) => console.log('User not logged in!'),
    (data: UserInfo) => setGlobalState('user', data)
  );


  const submit = async (data: FormData) => {
    // const res: AuthResponse = await Https.Get('/login');
    // login(res);
  };

  return (
    <div className="tax-full">
      <div className="tax-title-line">
        <div className="tax-mid">Please Sign In
          <a href={loginUrl} className="google-btn">
            <div className="google-icon-wrapper">
              <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
            </div>
            <p className="btn-text"><b>Sign in with google</b></p>
          </a></div>
      </div>
      <div className="tax-mid">





      </div>
    </div>
  );
}