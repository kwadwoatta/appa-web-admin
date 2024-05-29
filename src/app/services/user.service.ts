import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from 'src/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  me = () => this.http.get<User>(`http://localhost:3000/api/user/me`);

  userById = (userId: number) =>
    this.http.get<User>(`http://localhost:3000/api/user/${userId}`);

  allUsers = () => this.http.get<Array<User>>('http://localhost:3000/api/user');

  createUser = (dto: CreateUserDto) =>
    this.http.post<User>(`http://localhost:3000/api/user`, dto);
}

export interface CreateUserDto extends User {}
