import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Delivery } from 'src/common';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  http = inject(HttpClient);

  deliveryById = (deliveryId: number) =>
    this.http.get<Delivery>(`http://localhost:3000/api/delivery/${deliveryId}`);

  allDeliveries = () =>
    this.http.get<Array<Delivery>>('http://localhost:3000/api/delivery');

  createDelivery = (dto: CreateDeliveryDto) =>
    this.http.post<Delivery>(`http://localhost:3000/api/delivery`, dto);
}

export type CreateDeliveryDto = Omit<
  Delivery,
  '_id' | 'createdAt' | 'updatedAt' | 'package' | 'customer' | 'driver'
> & {
  package: string;
  customer: string;
  driver: string;
};
