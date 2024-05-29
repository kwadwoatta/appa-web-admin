import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  CreatePackageDto,
  PackageService,
} from 'src/app/services/package.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/common';
import { z } from 'zod';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TanStackField,
    CommonModule,
  ],
  templateUrl: './package.component.html',
  styleUrl: './package.component.css',
})
export class PackageComponent {
  constructor(private router: Router) {}

  packageService = inject(PackageService);
  packageMutation = injectMutation(() => ({
    mutationFn: (dto: CreatePackageDto) =>
      lastValueFrom(this.packageService.createPackage(dto)).then(response => {
        this.router.navigate(['/dashboard']);
      }),
  }));

  userService = inject(UserService);
  userQuery = injectQuery(() => ({
    enabled: true,
    queryKey: ['package'],
    queryFn: async context => {
      const abort = fromEvent(context.signal, 'abort');
      return lastValueFrom(this.userService.allUsers().pipe(takeUntil(abort)));
    },
  }));

  queryClient = injectQueryClient();

  getUsers(): Observable<User[]> {
    return of(this.userQuery.data() ?? []);
  }

  uuidValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      return { invalidUuid: true };
    }

    return null;
  }

  geoJsonPointValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    const valueArray = value.split(',');
    console.log({ value });

    if (!Array.isArray(valueArray) || valueArray.length !== 2) {
      return { invalidGeoJsonPoint: true };
    }

    const [longitude, latitude] = valueArray.map(parseFloat);

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return { invalidGeoJsonPoint: true };
    }

    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return { invalidGeoJsonPoint: true };
    }

    return null;
  }

  firstNameAsyncValidator = z.string().refine(
    async value => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return !value.includes('error');
    },
    {
      message: "No 'error' allowed in first name",
    }
  );

  form = injectForm({
    defaultValues: {
      description: '',
      weight: 0,
      width: 0,
      height: 0,
      depth: 0,
      from_address: '',
      from_location: '',
      to_address: '',
      to_location: '',
      from_user: '',
      to_user: '',
    },
    onSubmit: ({ value }) => {
      console.log({ value });

      // this.packageMutation.mutate({
      //   description: value.description,
      //   weight: value.weight,
      //   width: value.width,
      //   height: value.height,
      //   depth: value.depth,
      //   from_address: value.from_address,
      //   from_location: {
      //     type: 'Point',
      //     coordinates: value.from_location.split(',').map(parseFloat),
      //   },
      //   to_address: value.to_address,
      //   to_location: {
      //     type: 'Point',
      //     coordinates: value.to_location.split(',').map(parseFloat),
      //   },
      //   deliveries: [],
      //   from_user: value.from_user,
      //   to_user: value.to_user,
      // });
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator,
  });

  // onChange = (v: EventEmitter<DropdownChangeEvent>) => {
  //   v.emit()
  //   console.log('here');
  //   console.log({ v });
  // };

  z = z;

  canSubmit = injectStore(this.form, state => state.canSubmit);
  isSubmitting = injectStore(this.form, state => state.isSubmitting);

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.form.handleSubmit();
  }
}
