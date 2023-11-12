export class UserApiProvider {
  isAuthenticated(): boolean {
    const userToken = localStorage.getItem('veda_access_token');
    if (userToken) {
      return true;
    }
    return false;
  }

  isAdmin() {
    return true;
  }

  isUser() {
    return false;
  }
}
