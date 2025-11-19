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
        console.log("data res: ", res)
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    })
  }
}
