import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
  ],
  providers: [DatePipe],
  templateUrl: './list-table.html',
  styleUrl: './list-table.css',
})
export class ListTable implements OnChanges {
  private _dataSource: Data<Role> = {};
  private _columnConfig: ColumnConfig[] = [];

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
    this.displayedColumns = value?.map((col) => col.key) ?? [];
  }
  get columnConfig(): ColumnConfig[] {
    return this._columnConfig;
  }
  @Input() params!: ListRole;
  @Input() loading!: boolean;
  displayedColumns: string[] = [];
  matDataSource = new MatTableDataSource<any>([]);
  @Output() paramsChange = new EventEmitter<ListRole>();
  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnConfig']) {
      this.displayedColumns = this.columnConfig?.map((col) => col.key) ?? [];
    }
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
}
