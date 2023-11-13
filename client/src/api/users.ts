export class UserApiProvider {
  isAuthenticated(): boolean {
    const userToken = localStorage.getItem('vedaAccessToken');
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
