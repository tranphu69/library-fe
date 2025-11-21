import { Component, inject, ChangeDetectorRef, signal, effect } from '@angular/core';
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
    { key: 'index', label: '#', width: 50 },
    { key: 'name', label: 'Tên', width: 180 },
    { key: 'description', label: 'Mô tả', width: 180 },
    { key: 'action', label: 'Trạng thái', width: 180 },
    { key: 'createdAt', label: 'Ngày tạo', width: 180 },
    { key: 'updatedAt', label: 'Ngày cập nhật', width: 180 },
    { key: 'createdBy', label: 'Người tạo', width: 180 },
    { key: 'updatedBy', label: 'Người cập nhật', width: 180 },
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
  });

  constructor() {
    effect(
      () => {
        const currentParams = this.params();
        this.loadRoles(currentParams);
      },
      { allowSignalWrites: true }
    );
  }

  loadRoles(params: ListRole) {
    this.isLoading.set(true);
    this.roleService.getListRoles(params).subscribe({
      next: (res) => {
        this.data.set(
          res?.result?.data?.map((item, index) => ({ ...item, index: index + 1 })) ?? []
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error roles: ', err);
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(page: number) {
    this.params.update((p) => ({ ...p, page }));
  }
}
