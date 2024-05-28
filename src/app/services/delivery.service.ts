import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  http = inject(HttpClient);

  deliveryById = (deliveryId: number) =>
    this.http.get<Delivery>(`/delivery/${deliveryId}`);

  allPosts = () => this.http.get<Array<Delivery>>('/delivery');
}

export interface DeliveryDto {
  email: number;
  password: string;
}
export interface Delivery {
  access_token: string;
}
