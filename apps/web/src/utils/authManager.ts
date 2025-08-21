export class AuthHeaderManager {
  static getHeaders(): Headers {
    const token = localStorage.getItem('conexa_token');
    const headers = new Headers({ 'Content-Type': 'application/json' });

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
