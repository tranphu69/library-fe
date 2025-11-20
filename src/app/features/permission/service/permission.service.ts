import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ListPermission, Permission } from '../../../models/permission.model';
import { Data } from '../../../models/base.model';

@Injectable({
  providedIn: 'root'
})

export class PermissionService {
    private apiService = inject(ApiService);

    getListPermissions(params?: ListPermission): Observable<Data<Permission>> {
        return this.apiService.get<Data<Permission>>("permission", params);
    }
}