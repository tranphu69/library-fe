import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ListUser, User } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    private apiService = inject(ApiService);

    getListUsers(params?: ListUser): Observable<any> {
        return this.apiService.post<any>("user/list", params);
    }
}