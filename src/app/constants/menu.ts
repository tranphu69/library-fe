import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'home',
          label: 'Trang chủ',
          route: '/home',
          role: [],
        },
        {
          icon: 'dashboard',
          label: 'Thống kê',
          route: '/dashboard',
          role: [],
        },
        {
          icon: 'user',
          label: 'Quản lý người dùng',
          route: '/user',
          role: [],
        },
        {
          icon: 'role',
          label: 'Quản lý vai trò',
          route: '/role',
          role: [],
        },
        {
          icon: 'permission',
          label: 'Quản lý thao tác',
          route: '/permission',
          role: [],
        },
      ],
    },
  ];
}
