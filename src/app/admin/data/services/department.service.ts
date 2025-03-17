import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department, DepartmentResponse } from '../types/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  public getDepartments(): Observable<DepartmentResponse>{
    const departmentsUrl = `${environment.ROOT_URL}/api/department/getAllDepartments`;

    return this.http.get<DepartmentResponse>(departmentsUrl);
  }

  public addDepartment(department): Observable<{message: string}>{
    const addDepartmentUrl = `${environment.ROOT_URL}/api/departments/newDepartment`;

    return this.http.post<{message: string}>(addDepartmentUrl, department)
  }

  public updateDepartment(department): Observable<{message: string}>{
    const updateDepartmentUrl = `${environment.ROOT_URL}api/departments/updateDepartment`;

    return this.http.put<{message: string}>(updateDepartmentUrl, department);
  }

  public deleteDepartment(departmentId): Observable<{message: string}>{
    const deleteDepartmentUrl = `${environment.ROOT_URL}/api/departments/delete/${departmentId}`;

    return this.http.delete<{message: string}>(deleteDepartmentUrl);
  }
}
