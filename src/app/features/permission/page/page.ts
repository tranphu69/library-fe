import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../service/permission.service';
import { ListPermission, Permission } from '../../../models/permission.model';
import { ListTable } from '../component/list-table/list-table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page',
  imports: [CommonModule, FormsModule, ListTable],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page implements OnInit {
  private permissionService = inject(PermissionService);
  private cdr = inject(ChangeDetectorRef);
  columnConfig = [
    { key: 'index', label: '#', width: 50 },
    { key: 'name', label: 'Tên', width: 180 },
    { key: 'description', label: 'Mô tả', width: 180 },
    { key: 'action', label: 'Trạng thái', width: 180 },
    { key: 'createdAt', label: 'Ngày tạo', width: 180 },
    { key: 'updatedAt', label: 'Ngày cập nhật', width: 180 },
    { key: 'createdBy', label: 'Người tạo', width: 180 },
    { key: 'updatedBy', label: 'Người cập nhật', width: 180 },
  ];
  data: Permission[] = [];
  isLoading = true;
  params: ListPermission = {
    name: '',
    action: '',
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortType: 'DESC',
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.permissionService.getListPermissions(this.params).subscribe({
      next: (res) => {
        this.data = res?.result?.data?.map((item, index) => ({ ...item, index: index + 1 })) ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error loading permissions:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateParams(newParams: Partial<ListPermission>) {
    this.params = { ...this.params, ...newParams };
    this.loadUsers();
  }
}
