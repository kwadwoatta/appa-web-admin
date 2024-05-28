import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Delivery } from 'src/common';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  http = inject(HttpClient);

  deliveryById = (deliveryId: number) =>
    this.http.get<Delivery>(`/delivery/${deliveryId}`);

  allDeliveries = () => this.http.get<Array<Delivery>>('/delivery');

  createDelivery = (dto: CreateDeliveryDto) =>
    this.http.post<Delivery>(`/delivery`, dto);
}

export interface CreateDeliveryDto extends Delivery {}
