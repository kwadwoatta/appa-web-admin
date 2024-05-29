import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectForm, injectStore, TanStackField } from '@tanstack/angular-form';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { fromEvent, lastValueFrom, Observable, of, takeUntil } from 'rxjs';
import {
  CreateDeliveryDto,
  DeliveryService,
} from 'src/app/services/delivery.service';
import { PackageService } from 'src/app/services/package.service';
import { UserService } from 'src/app/services/user.service';
import { DeliveryStatus, Package, User } from 'src/common';
import { z } from 'zod';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TanStackField,
    CommonModule,
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css',
})
export class DeliveryComponent {
  constructor(private router: Router) {}

  deliveryService = inject(DeliveryService);
  deliveryMutation = injectMutation(() => ({
    mutationFn: (dto: CreateDeliveryDto) =>
      lastValueFrom(this.deliveryService.createDelivery(dto)).then(response => {
        this.router.navigate(['/dashboard']);
      }),
  }));

  userService = inject(UserService);
  userQuery = injectQuery(() => ({
    enabled: true,
    queryKey: ['user'],
    queryFn: async context => {
      const abort = fromEvent(context.signal, 'abort');
      return lastValueFrom(this.userService.allUsers().pipe(takeUntil(abort)));
    },
  }));

  getUsers(): Observable<User[]> {
    return of(this.userQuery.data() ?? []);
  }

  packageService = inject(PackageService);
  packageQuery = injectQuery(() => ({
    enabled: true,
    queryKey: ['package'],
    queryFn: async context => {
      const abort = fromEvent(context.signal, 'abort');
      return lastValueFrom(
        this.packageService.allPackages().pipe(takeUntil(abort))
      );
    },
  }));

  getPackages(): Observable<Package[]> {
    return of(this.packageQuery.data() ?? []);
  }

  queryClient = injectQueryClient();

  form = injectForm({
    defaultValues: {
      package: '',
      customer: '',
      driver: '',
    },
    onSubmit: ({ value }) => {
      const driver = this.userQuery
        .data()
        ?.find(user => user._id === value.driver);
      const recipient = this.userQuery
        .data()
        ?.find(user => user._id === value.customer);

      const description = `Delivery of package. Driver (${driver?.firstName} ${driver?.lastName}) -> Customer (${recipient?.firstName} ${recipient?.lastName})`;

      const dto: CreateDeliveryDto = {
        description,
        status: DeliveryStatus.Open,
        package: value.package,
        customer: value.customer,
        driver: value.driver,
      };

      console.log({ dto });

      this.deliveryMutation.mutate(dto, {
        onSuccess: () => {
          this.router.navigate(['/dashboard']);
        },
        onError: e => {
          console.log({ e });
          alert(JSON.stringify((e as any).error.message));
        },
      });
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator,
  });

  z = z;

  canSubmit = injectStore(this.form, state => state.canSubmit);
  isSubmitting = injectStore(this.form, state => state.isSubmitting);

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }
}
