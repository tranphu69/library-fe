import {
  Component,
  input,
  Output,
  EventEmitter,
  inject,
  TemplateRef,
  viewChild,
  effect,
} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-warning-popup',
  imports: [MatDialogModule, CommonModule, MatDividerModule, MatButtonModule],
  template: `
    <ng-template #dialogTemplate>
      <div class="css-icon-title" mat-dialog-title>
        <img src="assets/icons/warning-icon.svg" alt="warning icon" width="24" height="24" />
      </div>
      <mat-dialog-content>
        <div class="css-title">{{ title() }}</div>
        <div class="css-description">{{ description() }}</div>
      </mat-dialog-content>
      <mat-divider></mat-divider>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close (click)="closeDialog()">
          {{ 'Đóng' }}
        </button>
        <button mat-raised-button color="primary" (click)="onConfirm()">
          {{ 'Xác nhận' }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [
    `
      .css-icon-title {
        padding: 20px 24px;
        display: flex;
      }
      .css-title {
        font-weight: 600;
        font-size: 20px;
        color: black;
        margin-bottom: 10px;
      }
      .css-description {
        font-weight: 500;
        font-size: 14px;
      }
      .mat-mdc-dialog-actions {
        justify-content: flex-end;
      }
    `,
  ],
})
export class WarningPopup {
  private dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<any> | null = null;

  dialogTemplate = viewChild<TemplateRef<any>>('dialogTemplate');
  isOpen = input<boolean>(false);
  title = input<string>('');
  description = input<string>('');
  @Output() openModalChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();

  constructor() {
    effect(() => {
      const template = this.dialogTemplate();
      const isOpen = this.isOpen();
      if (isOpen && template && !this.dialogRef) {
        this.dialogRef = this.dialog.open(template, {
          width: '400px',
          disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
          this.openModalChange.emit(false);
        });
      } else if (!isOpen && this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
      }
    });
  }

  onConfirm() {
    this.confirmed.emit();
    this.closeDialog();
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.openModalChange.emit(false);
  }
}
