import { Component, signal } from '@angular/core';
import { Menu } from '../../constants/menu';
import { MenuItem, SubMenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  pagesMenu = signal<MenuItem[]>([]);

  constructor() {
    this.pagesMenu.set(Menu.pages);
  }
}
