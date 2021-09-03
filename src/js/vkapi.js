export const vkapi = {
  auth(appId, permissions = 2) {
    return new Promise((resolve, reject) => {
      VK.init({ apiId: appId });

      VK.Auth.login(data => {
        if (data.session) {
          resolve()
        }
        else {
          reject(new Error('Не удалось авторизоваться'))
        }
      }, permissions)
    })
  },

  callApi(method, params) {
    params.v = params.v || '5.131';

    return new Promise((resolve, reject) => {

      VK.api(method, params, (data) => {
        if (data.error) {
          reject(new Error(data.error.error_msg))
        }
        else {
          resolve(data.response);
        }
      })

    })
  },

  getUser(params = {}) {
    return this.callApi('users.get', params);
  },

  getFriends(params = {}) {
    return this.callApi('friends.get', params);
  }
}