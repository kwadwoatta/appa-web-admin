import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Package } from 'src/common';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  http = inject(HttpClient);

  packageById = (packageId: number) =>
    this.http.get<Package>(`/package/${packageId}`);

  allDeliveries = () => this.http.get<Array<Package>>('/package');

  createPackage = (dto: CreatePackageDto) =>
    this.http.post<Package>(`/package`, dto);
}

export interface CreatePackageDto extends Package {}
