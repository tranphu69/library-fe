import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Menu } from '../../constants/menu';
import { MenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  pagesMenu = signal<MenuItem[]>([]);
  @Output() menuSelect = new EventEmitter<string>();

  constructor() {
    this.pagesMenu.set(Menu.pages);
  }

  selectItem(item: { label?: string }) {
    if (item.label) {
      this.menuSelect.emit(item.label);
    }
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
