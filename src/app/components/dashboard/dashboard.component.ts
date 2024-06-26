import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { fromEvent, lastValueFrom, takeUntil } from 'rxjs';
import { DeliveryService } from 'src/app/services/delivery.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  packageService = inject(PackageService);
  deliveryService = inject(DeliveryService);

  @Output() setPostId = new EventEmitter<number>();

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

  deliveryQuery = injectQuery(() => ({
    enabled: true,
    queryKey: ['delivery'],
    queryFn: async context => {
      const abort = fromEvent(context.signal, 'abort');
      return lastValueFrom(
        this.deliveryService.allDeliveries().pipe(takeUntil(abort))
      );
    },
  }));

  queryClient = injectQueryClient();
}
