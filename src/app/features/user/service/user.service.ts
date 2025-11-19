import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ListUser, User } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    private apiService = inject(ApiService);

    getListUsers(params?: ListUser): Observable<User[]> {
        return this.apiService.post<User[]>("user/list", params);
    }
}