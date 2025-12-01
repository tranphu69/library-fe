import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ListRole } from '../../../../models/role.model';
import { RoleService } from '../../service/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Permission } from '../../../../models/permission.model';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-filter-table',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './filter-table.html',
  styleUrl: './filter-table.css',
})
export class FilterTable {
  private roleService = inject(RoleService);
  private fb = inject(FormBuilder);

  suggestions$!: Observable<any[]>;
  @Input() listPermissions: Permission[] = [];
  @Output() onModalChangeImport = new EventEmitter<boolean>();
  @Output() openModalChange = new EventEmitter<boolean>();
  @Output() paramsChange = new EventEmitter<ListRole>();
  @Input() params!: ListRole;
  roleFormFilter: FormGroup;
  actions = [
    { value: 0, label: 'Không hoạt động' },
    { value: 1, label: 'Hoạt động' },
  ];

  constructor(private snackBar: MatSnackBar) {
    this.roleFormFilter = this.fb.group({
      name: [''],
      action: [''],
      permissions: [''],
    });
  }

  ngOnInit() {
    this.suggestions$ = this.roleFormFilter.get('name')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        let trimValue = value?.trim();
        if (trimValue && trimValue.length >= 2) {
          return this.roleService.getAutoSearch(trimValue);
        }
        return [];
      })
    );
  }

  onFilter() {
    const formValue = this.roleFormFilter.value;
    console.log('formValue', formValue);
    const updatedParams = {
      ...this.params,
      name: formValue?.name.trim() ?? '',
      permissions: formValue?.permissions.length ? formValue?.permissions : '',
      action: formValue?.action ?? '',
    };
    this.paramsChange.emit(updatedParams);
  }

  onCreate() {
    this.openModalChange.emit(true);
  }

  onOpenImport() {
    this.onModalChangeImport.emit(true);
  }

  onExport() {
    this.roleService.postExport(this.params).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ds_roles.xlsx';
        a.click();
        URL.revokeObjectURL(url);
        this.snackBar.open('Tải xuống thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.log('err: ', err);
        this.snackBar.open('Tải xuống không thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      },
    });
  }
}
