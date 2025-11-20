import { Component, Input, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { ColumnConfig } from '../../../../models/base.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ListPermission } from '../../../../models/permission.model';

@Component({
  selector: 'app-list-table',
  standalone: true,
  imports: [MatTableModule, CommonModule, TruncatePipe, MatPaginatorModule],
  providers: [DatePipe],
  templateUrl: './list-table.html',
  styleUrl: './list-table.css',
})
export class ListTable implements OnChanges {
  @Input() dataSource: any[] = [];
  @Input() columnConfig: ColumnConfig[] = [];
  @Input() params!: ListPermission;
  @Output() paramsChange = new EventEmitter<Partial<ListPermission>>();

  tableDataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private datePipe: DatePipe) {}

  ngOnChanges() {
    this.tableDataSource = new MatTableDataSource(
      this.dataSource?.map((item) => ({
        ...item,
        action: item.action === 1 ? 'Hoạt động' : 'Không hoạt động',
        createdAt: this.datePipe.transform(item.createdAt, 'dd/MM/yyyy HH:mm:ss'),
        updatedAt: this.datePipe.transform(item.updatedAt, 'dd/MM/yyyy HH:mm:ss'),
      })) ?? []
    );
    this.displayedColumns = this.columnConfig?.map((col) => col.key) ?? [];
    if (this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
  }

  getColumnLabel(key: string): string {
    return this.columnConfig.find((col) => col.key === key)?.label || key;
  }

  changePage(newPage: number) {
    this.paramsChange.emit({ page: newPage });
  }

  changePageSize(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newSize = Number(select.value);
    this.paramsChange.emit({ size: newSize, page: 0 });
  }
}
