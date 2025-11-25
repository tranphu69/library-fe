import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Data, DataDetail } from '../../../models/base.model';
import { ListRole, Role } from '../../../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiService = inject(ApiService);

  getListRoles(params?: ListRole): Observable<Data<Role>> {
    return this.apiService.get<Data<Role>>('role', params);
  }

  getDetail(params?: number): Observable<DataDetail<Role>> {
    return this.apiService.get<DataDetail<Role>>(`role/${params}`);
  }

  postListDeletes(params?: number[]): Observable<string> {
    return this.apiService.post<string>('role/delete', { list: params });
  }
}
