import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { FormsModule } from '@angular/forms';
import { ListUser } from '../../../models/user.model';
import { ListTable } from '../component/list-table/list-table';

@Component({
  selector: 'app-page',
  imports: [CommonModule, FormsModule, ListTable],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page implements OnInit {
  private userService = inject(UserService);
  columns = [
    "#", 
    "Tên người dùng", 
    "Email", 
    "Tên đầy đủ", 
    "Mã người dùng", 
    "Số điện thoại", 
    "Ngành học", 
    "Khóa học", 
    "Chức vụ", 
    "Giới tính", 
    "Ngày sinh", 
    "Trạng thái", 
    "Ngày tạo", 
    "Ngày cập nhật", 
    "Người tạo", 
    "Người cập nhật", 
    "Lần đăng nhập gần nhất", 
    "Số lần đăng nhập sai", 
    "Thời điểm hết hạn khóa", 
    "Xác thực bậc hai", 
    "Vai trò"
  ];
  data = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const params: ListUser = {
      username: null,
      email: null,
      fullName: null,
      code: null,
      phone: null,
      major: null,
      course: null,
      position: null,
      gender: null,
      dob: null,
      status: null,
      roles: "",
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortType: 'DESC',
    };
    this.userService.getListUsers(params).subscribe({
      next: (res) => {
        this.data = res?.result?.data || [];
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    })
  }
}
