import {
  Component,
  inject,
  input,
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
import { Role } from '../../../../models/role.model';

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
  ],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.css',
})
export class FormModal {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private dialogRef: MatDialogRef<any> | null = null;

  dialogTemplate = viewChild<TemplateRef<any>>('dialogTemplate');
  isOpen = input<boolean>(false);
  record = input<Role | null>(null);
  @Output() openModalChange = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<Role>();
  roleForm: FormGroup;
  actions = [
    { value: 0, label: 'Không hoạt động' },
    { value: 1, label: 'Hoạt động' },
  ];

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      action: ['', Validators.required],
    });
    effect(() => {
      const template = this.dialogTemplate();
      const recordData = this.record();
      if (this.isOpen() && template && !this.dialogRef) {
        if (recordData) {
          this.roleForm.patchValue({
            name: recordData.name,
            description: recordData.description,
            action: recordData.action,
          });
        } else {
          this.roleForm.reset();
        }
        this.dialogRef = this.dialog.open(template, {
          width: '500px',
          disableClose: true,
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
          this.openModalChange.emit(false);
          this.roleForm.reset();
        });
      } else if (!this.isOpen() && this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
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
      this.formSubmit.emit(formValue);
      this.closeDialog();
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
