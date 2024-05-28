import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  login = (email: string, password: string) =>
    this.http.post<Auth>(`/auth/login`, {
      email,
      password,
    });
}

export interface AuthDto {
  email: number;
  password: string;
}
export interface Auth {
  access_token: string;
}
