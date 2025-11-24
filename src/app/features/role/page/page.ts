import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../service/role.service';
import { ListRole, Role } from '../../../models/role.model';
import { ListTable } from '../component/list-table/list-table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page',
  imports: [CommonModule, FormsModule, ListTable],
  templateUrl: './page.html',
  styleUrl: './page.css',
})

export class Page {
  private roleService = inject(RoleService);
  columnConfig = [
    { key: 'index', label: '#', width: 50, sortable: false },
    { key: 'name', label: 'Tên', width: 180, sortable: true },
    { key: 'description', label: 'Mô tả', width: 180, sortable: false },
    { key: 'action', label: 'Trạng thái', width: 180, sortable: true },
    { key: 'permissions', label: 'Các quyền thao tác', width: 180, sortable: false},
    { key: 'createdAt', label: 'Ngày tạo', width: 180, sortable: true },
    { key: 'updatedAt', label: 'Ngày cập nhật', width: 180, sortable: true },
    { key: 'createdBy', label: 'Người tạo', width: 180, sortable: true },
    { key: 'updatedBy', label: 'Người cập nhật', width: 180, sortable: true },
  ];
  data = signal<Role[]>([]);
  isLoading = signal(true);
  params = signal<ListRole>({
    name: '',
    action: '',
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortType: 'DESC',
    permissions: ''
  });

  constructor() {
    effect(
      () => {
        const currentParams = this.params();
        this.loadRoles(currentParams);
      }
    );
  }

  loadRoles(params: ListRole) {
    this.isLoading.set(true);
    this.roleService.getListRoles(params).subscribe({
      next: (res) => {
        this.data.set(res?.result?.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error roles: ', err);
        this.isLoading.set(false);
      },
    });
  }
}
