import {
  Component,
  inject,
  input,
  Input,
  effect,
  Output,
  TemplateRef,
  EventEmitter,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Role, ListRole } from '../../../../models/role.model';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../service/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from '../../../../models/permission.model';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.css',
})
export class FormModal {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private dialogRef: MatDialogRef<any> | null = null;
  private roleService = inject(RoleService);

  dialogTemplate = viewChild<TemplateRef<any>>('dialogTemplate');
  isOpen = input<boolean>(false);
  record = input<Role | null>(null);
  @Input() listPermissions: any[] = [];
  @Input() params!: ListRole;
  @Output() paramsChange = new EventEmitter<ListRole>();
  @Output() openModalChange = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<Role>();
  roleForm: FormGroup;
  actions = [
    { value: 0, label: 'Không hoạt động' },
    { value: 1, label: 'Hoạt động' },
  ];

  constructor(private snackBar: MatSnackBar) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      action: ['', Validators.required],
      permissions: ['', Validators.required],
    });
    effect(() => {
      const template = this.dialogTemplate();
      const isOpen = this.isOpen();
      if (isOpen && template && !this.dialogRef) {
        this.dialogRef = this.dialog.open(template, {
          width: '500px',
          disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
          this.roleForm.reset();
          this.roleForm.enable();
          this.openModalChange.emit(false);
        });
      } else if (!isOpen && this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
        this.roleForm.reset();
        this.roleForm.enable();
      }
    });
    effect(() => {
      const recordData = this.record();
      const arrayIdPermissions = this.record()?.permissions?.map((item) => item.id) ?? [];
      const isOpen = this.isOpen();
      if (isOpen && this.dialogRef) {
        this.roleForm.reset();
        this.roleForm.enable();
        if (recordData) {
          this.roleForm.patchValue({
            name: recordData.name,
            description: recordData.description,
            action: recordData.action,
            permissions: arrayIdPermissions,
          });
          if (recordData.edit === false) {
            this.roleForm.disable();
          }
        }
      }
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.roleForm.reset();
    this.openModalChange.emit(false);
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      if (this.record()) {
        this.roleService.putEdit(formValue, this.record()?.id).subscribe({
          next: (res) => {
            this.closeDialog();
            this.snackBar.open('Cập nhật thành công!', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'left',
              verticalPosition: 'top',
            });
            this.paramsChange.emit({ ...this.params });
          },
          error: (err) => {
            console.log('err: ', err);
            this.snackBar.open('Cập nhật không thành công!', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'left',
              verticalPosition: 'top',
            });
          },
        });
      } else {
        this.roleService.postCreate(formValue).subscribe({
          next: (res) => {
            this.closeDialog();
            this.snackBar.open('Tạo mới thành công!', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'left',
              verticalPosition: 'top',
            });
            this.paramsChange.emit({ ...this.params });
          },
          error: (err) => {
            console.log('err: ', err);
            this.snackBar.open('Tạo mới không thành công!', 'Đóng', {
              duration: 3000,
              horizontalPosition: 'left',
              verticalPosition: 'top',
            });
          },
        });
      }
    } else {
      Object.keys(this.roleForm.controls).forEach((key) => {
        this.roleForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.roleForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Trường này là bắt buộc';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Tối thiểu ${minLength} ký tự`;
    }
    return '';
  }
}
