import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ListRole } from '../../../../models/role.model';
import { RoleService } from '../../service/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filter-table',
  imports: [MatButtonModule],
  templateUrl: './filter-table.html',
  styleUrl: './filter-table.css',
})
export class FilterTable {
  private roleService = inject(RoleService);

  @Output() onModalChangeImport = new EventEmitter<boolean>();
  @Output() openModalChange = new EventEmitter<boolean>();
  @Input() params!: ListRole;

  constructor(private snackBar: MatSnackBar) {}

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
