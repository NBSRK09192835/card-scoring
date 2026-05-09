import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogHostData {
  type: 'prompt' | 'confirm';
  title: string;
  message: string;
  inputLabel?: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-dialog-host',
  templateUrl: './dialog-host.component.html',
  styleUrls: ['./dialog-host.component.scss']
})
export class DialogHostComponent {
  value = '';

  constructor(
    public dialogRef: MatDialogRef<DialogHostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogHostData
  ) {}

  confirm(): void {
    if (this.data.type === 'prompt') {
      const result = this.value?.trim();
      this.dialogRef.close(result || undefined);
      return;
    }

    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
