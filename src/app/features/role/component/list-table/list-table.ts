import { AfterViewInit, Component, Input, ViewChild, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ColumnConfig } from '../../../../models/base.model';
import { ListRole, Role } from '../../../../models/role.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-list-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, TruncatePipe, MatSortModule],
  providers: [DatePipe],
  templateUrl: './list-table.html',
  styleUrl: './list-table.css',
})
export class ListTable implements AfterViewInit, OnChanges {
  private _dataSource: Role[] = [];
  private _columnConfig: ColumnConfig[] = [];
  private _liveAnnouncer = inject(LiveAnnouncer);

  @Input()
  set dataSource(value: Role[]) {
    this._dataSource = value;
    this.transformData();
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
  displayedColumns: string[] = [];
  matDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnConfig']) {
      this.displayedColumns = this.columnConfig?.map((col) => col.key) ?? [];
    }
  }

  ngAfterViewInit() {
    this.matDataSource.sort = this.sort
    this.matDataSource.paginator = this.paginator;
  }

  private transformData(): void {
    const transformedData =
      this._dataSource?.map((item, index) => ({
        ...item,
        index: index + 1,
        action: item.action === 1 ? 'Hoạt động' : 'Không hoạt động',
        permissions: item?.permissions?.map((ele) => ele.name).join(', '),
        createdAt: this.datePipe.transform(item.createdAt, 'dd/MM/yyyy HH:mm:ss'),
        updatedAt: this.datePipe.transform(item.updatedAt, 'dd/MM/yyyy HH:mm:ss'),
      })) ?? [];
    this.matDataSource.data = transformedData;
    if (this.paginator) {
      this.matDataSource.paginator = this.paginator;
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getColumnLabel(key: string): string {
    return this.columnConfig.find((col) => col.key === key)?.label || key;
  }
}