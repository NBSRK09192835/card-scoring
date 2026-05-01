import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  toasts$: Observable<Toast | null>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toast$;
  }
}