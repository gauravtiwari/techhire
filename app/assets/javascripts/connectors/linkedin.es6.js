/* global window IN Routes */

import $ from 'jquery';

export default class Linkedin {
  constructor() {
    $.getScript(window.LINKEDIN_JS_SDK_URL, (data, textStatus) => {
      if (textStatus === 'success') {
        IN.init({
          api_key: window.LINKEDIN_CLIENT_ID,
          scope: 'r_basicprofile r_emailaddress',
          lang: 'en_US',
          authorize: true,
          credentials_cookie: true,
        });
      }
    });
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      IN.User.authorize(() => {
        resolve({ access_token: IN.ENV.auth.oauth_token, uid: IN.ENV.auth.member_id });
      }, () => { reject('Can not login. Please try again!'); });
    });
  }
}
