export interface Department {
  id?: number,
  departmentName?: string,
  departmentCode?: string,
}
export interface DepartmentResponse {
  message: string;
  statusCode: number;
  entity: Department[];
}
