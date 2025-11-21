import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Data } from '../../../models/base.model';
import { ListRole, Role } from '../../../models/role.model';

@Injectable({
  providedIn: 'root'
})

export class RoleService {
    private apiService = inject(ApiService)

    getListRoles(params?: ListRole): Observable<Data<Role>> {
        return this.apiService.get<Data<Role>>("role", params);
    }
}