import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '../../../../models/role.model';

@Component({
  selector: 'app-filter-table',
  imports: [MatButtonModule],
  templateUrl: './filter-table.html',
  styleUrl: './filter-table.css',
})
export class FilterTable {
  @Output() openModalChange = new EventEmitter<boolean>();

  onCreate() {
    this.openModalChange.emit(true);
  }
}
