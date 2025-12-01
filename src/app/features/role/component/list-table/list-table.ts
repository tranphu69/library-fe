import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { ColumnConfig } from '../../../../models/base.model';
import { ListRole, Role } from '../../../../models/role.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sort, MatSortModule } from '@angular/material/sort';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { PageEvent } from '@angular/material/paginator';
import { Data } from '../../../../models/base.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../service/role.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-list-table',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    TruncatePipe,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [DatePipe],
  templateUrl: './list-table.html',
  styleUrl: './list-table.css',
})
export class ListTable implements OnChanges {
  private _dataSource: Data<Role> = {};
  private _columnConfig: ColumnConfig[] = [];
  private roleService = inject(RoleService);

  @Input()
  set dataSource(value: Data<Role>) {
    this._dataSource = value;
    this.transformData();
  }
  get dataSource(): Data<Role> {
    return this._dataSource;
  }
  @Input()
  set columnConfig(value: ColumnConfig[]) {
    this._columnConfig = value;
    this.updateDisplayedColumns();
  }
  get columnConfig(): ColumnConfig[] {
    return this._columnConfig;
  }
  @Input() params!: ListRole;
  @Input() loading!: boolean;
  displayedColumns: string[] = [];
  matDataSource = new MatTableDataSource<any>([]);
  @Output() paramsChange = new EventEmitter<ListRole>();
  @Output() openModalChange = new EventEmitter<boolean>();
  @Output() onRecordChange = new EventEmitter<Role | null>();
  selection = new SelectionModel<any>(true, []);
  @Output() selectionChange = new EventEmitter<any[]>();

  constructor(private datePipe: DatePipe, private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnConfig']) {
      this.updateDisplayedColumns();
    }
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = [
      'select',
      ...(this.columnConfig?.map((col) => col.key) ?? []),
      'actions',
    ];
  }

  private emitSelectionChange() {
    this.selectionChange.emit(this.selection.selected);
  }

  private transformData(): void {
    const transformedData =
      this._dataSource?.result?.data?.map((item, index) => ({
        ...item,
        index: index + 1,
        action: item.action === 1 ? 'Hoạt động' : 'Không hoạt động',
        permissions: item?.permissions?.map((ele) => ele.name).join(', '),
        createdAt: this.datePipe.transform(item.createdAt, 'dd/MM/yyyy HH:mm:ss'),
        updatedAt: this.datePipe.transform(item.updatedAt, 'dd/MM/yyyy HH:mm:ss'),
      })) ?? [];
    this.matDataSource.data = transformedData;
    this.selection.clear();
  }

  getColumnLabel(key: string): string {
    return this.columnConfig.find((col) => col.key === key)?.label || key;
  }

  onPaginatorChange(event: PageEvent) {
    const updatedParams = {
      ...this.params,
      page: event.pageIndex,
      size: event.pageSize,
    };
    this.paramsChange.emit(updatedParams);
  }

  onSortChange(sortState: Sort) {
    let updatedParams;
    if (sortState?.direction) {
      updatedParams = {
        ...this.params,
        sortBy: sortState.active,
        sortType: sortState.direction === 'asc' ? 'ASC' : 'DESC',
      };
    } else {
      updatedParams = {
        ...this.params,
        sortBy: 'createdAt',
        sortType: 'DESC',
      };
    }
    this.paramsChange.emit(updatedParams);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.matDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.matDataSource.data.forEach((row) => this.selection.select(row));
    }
    this.emitSelectionChange();
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.emitSelectionChange();
  }

  onEdit(row: any) {
    this.openModalChange.emit(true);
    this.roleService.getDetail(row.id).subscribe({
      next: (res) => {
        const addEdit = res?.result ? { ...res?.result, edit: true } : null;
        this.onRecordChange.emit(addEdit);
      },
      error: (err) => {
        console.log('err: ', err);
      },
    });
  }

  onView(row: any) {
    this.openModalChange.emit(true);
    this.roleService.getDetail(row.id).subscribe({
      next: (res) => {
        const addEdit = res?.result ? { ...res?.result, edit: false } : null;
        this.onRecordChange.emit(addEdit);
      },
      error: (err) => {
        console.log('err: ', err);
      },
    });
  }

  onDelete(row: any) {
    this.roleService.postListDeletes([row.id]).subscribe({
      next: (res) => {
        this.snackBar.open('Xóa thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
        this.paramsChange.emit({
          ...this.params,
          sortBy: 'createdAt',
          sortType: 'DESC',
        });
      },
      error: (err) => {
        console.log('err: ', err);
        this.snackBar.open('Xóa không thành công!', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
        });
      },
    });
  }
}
