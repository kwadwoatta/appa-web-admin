import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { lastValueFrom } from 'rxjs';
import { PackageService } from 'src/app/services/package.service';
import { Package } from 'src/common';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './package.component.html',
  styleUrl: './package.component.css',
})
export class PackageComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  packageService = inject(PackageService);

  packageMutation = injectMutation(() => ({
    mutationFn: (dto: Package) =>
      lastValueFrom(this.packageService.createPackage(dto)).then((response) => {
        this.router.navigate(['/dashboard']);
      }),
  }));

  queryClient = injectQueryClient();

  formGroup: FormGroup | undefined;

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

    if (!Array.isArray(valueArray) || valueArray.length !== 2) {
      return { invalidGeoJsonPoint: true };
    }

    const [longitude, latitude] = valueArray;

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return { invalidGeoJsonPoint: true };
    }

    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return { invalidGeoJsonPoint: true };
    }

    return null;
  }

  ngOnInit() {
    this.formGroup = this.fb.group<Partial<Package> | any>({
      description: ['', [Validators.required, Validators.minLength(3)]],
      weight: [0, [Validators.required, Validators.min(1)]],
      width: [0, [Validators.required, Validators.min(1)]],
      height: [0, [Validators.required, Validators.min(1)]],
      depth: [0, [Validators.required, Validators.min(1)]],
      from_address: ['', [Validators.required, Validators.minLength(3)]],
      from_location: ['', [Validators.required, this.geoJsonPointValidator]],

      // to_name: ['', [Validators.required, Validators.minLength(3)]],
      to_address: ['', [Validators.required, Validators.minLength(3)]],
      to_location: ['', [Validators.required, this.geoJsonPointValidator]],

      // deliveries: ['', [Validators.required, Validators.minLength(3)]],
      from_user: ['', [Validators.required, this.uuidValidator]],
      to_user: ['', [Validators.required, this.uuidValidator]],
    });
  }

  onSubmit(): void {
    if (this.formGroup!.valid) {
      console.log(this.formGroup!.value);
      // this.packageMutation.mutate(this.formGroup?.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
