import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-table',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './list-table.html',
  styleUrl: './list-table.css',
})
export class ListTable {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
}
