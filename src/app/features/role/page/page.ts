import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../service/role.service';
import { ListRole, Role } from '../../../models/role.model';
import { ListTable } from '../component/list-table/list-table';
import { FormsModule } from '@angular/forms';
import { Data } from '../../../models/base.model';
import { FormModal } from '../component/form-modal/form-modal';
import { Permission } from '../../../models/permission.model';
import { FilterTable } from '../component/filter-table/filter-table';
import { ImportModal } from '../component/import-modal/import-modal';

@Component({
  selector: 'app-page',
  imports: [CommonModule, FormsModule, ListTable, FormModal, FilterTable, ImportModal],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  private roleService = inject(RoleService);

  columnConfig = [
    { key: 'index', label: '#', width: 50, sortable: false },
    { key: 'name', label: 'Tên', width: 160, sortable: true },
    { key: 'description', label: 'Mô tả', width: 200, sortable: false },
    { key: 'action', label: 'Trạng thái', width: 150, sortable: true },
    { key: 'permissions', label: 'Các quyền thao tác', width: 240, sortable: false },
    { key: 'createdAt', label: 'Ngày tạo', width: 180, sortable: true },
    { key: 'updatedAt', label: 'Ngày cập nhật', width: 180, sortable: true },
    { key: 'createdBy', label: 'Người tạo', width: 160, sortable: true },
    { key: 'updatedBy', label: 'Người cập nhật', width: 160, sortable: true },
  ];
  data = signal<Data<Role>>({});
  isLoading = signal(true);
  isOpenModal = signal(false);
  isOpenImport = signal(false);
  record = signal<Role | null>(null);
  params = signal<ListRole>({
    name: '',
    action: '',
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortType: 'DESC',
    permissions: '',
  });
  listPermission: Permission[] | [] = [];
  listSelect = signal<any[]>([]);

  constructor() {
    this.getListPermission();
    effect(() => {
      const currentParams = this.params();
      this.loadRoles(currentParams);
    });
    effect(() => {
      if (this.isOpenModal() === false) {
        this.record.set(null);
      }
    });
  }

  getListPermission() {
    const params = {
      name: '',
      action: '1',
      page: 0,
      size: 9999,
      sortBy: 'createdAt',
      sortType: 'DESC',
    };
    this.roleService.getListPermissionAction(params).subscribe({
      next: (res) => {
        this.listPermission = res.result?.data ?? [];
      },
      error: (err) => {
        console.log('err: ', err);
      },
    });
  }

  loadRoles(params: ListRole) {
    this.isLoading.set(true);
    this.roleService.getListRoles(params).subscribe({
      next: (res) => {
        this.data.set(res ?? {});
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Error roles: ', err);
        this.isLoading.set(false);
      },
    });
  }

  onModalChange(value: boolean | Event) {
    const newValue = typeof value === 'boolean' ? value : false;
    this.isOpenModal.set(newValue);
  }

  onModalChangeImport(value: boolean | Event) {
    const newValue = typeof value === 'boolean' ? value : false;
    this.isOpenImport.set(newValue);
  }

  onRecordChange(newRecord: Role | null) {
    this.record.set(newRecord);
  }

  onParamsChange(newParams: ListRole) {
    this.params.set(newParams);
  }

  onSelectionChange(selectedRows: any[]) {
    console.log('Selected rows:', selectedRows);
    if (selectedRows.length > 0) {
      this.listSelect.set(selectedRows.map((item) => item.id));
    } else {
      this.listSelect.set([]);
    }
  }
}
