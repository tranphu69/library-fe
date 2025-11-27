import {
  Component,
  inject,
  Output,
  EventEmitter,
  input,
  effect,
  viewChild,
  TemplateRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatDividerModule],
  templateUrl: './import-modal.html',
  styleUrl: './import-modal.css',
})
export class ImportModal {
  private dialogRef: MatDialogRef<any> | null = null;
  private dialog = inject(MatDialog);
  private roleService = inject(RoleService);

  @Output() onModalChangeImport = new EventEmitter<boolean>();
  dialogTemplate = viewChild<TemplateRef<any>>('dialogTemplate');
  isOpenImport = input<boolean>(false);

  constructor(private snackBar: MatSnackBar) {
    effect(() => {
      const template = this.dialogTemplate();
      const isOpen = this.isOpenImport();
      if (isOpen && template && !this.dialogRef) {
        this.dialogRef = this.dialog.open(template, {
          width: '500px',
          disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
          this.onModalChangeImport.emit(false);
        });
      } else if (!isOpen && this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
      }
    });
  }

  downloadTemplate() {
    this.roleService.getTemplate().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_role.xlsx';
        a.click();
        URL.revokeObjectURL(url);
        this.snackBar.open('Tải file mẫu thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.log('err: ', err);
        this.snackBar.open('Tải file mẫu không thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      },
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.onModalChangeImport.emit(false);
  }
}
