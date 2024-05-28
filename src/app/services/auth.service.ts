import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  login = (dto: AuthDto) => this.http.post<Auth>(`/auth/login`, dto);
}

export interface AuthDto {
  email: string;
  password: string;
}
export interface Auth {
  access_token: string;
}
