import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetModel } from '../_model/asset';
import { InsuranceModel } from '../_model/insurance';
import { MaintModel } from '../_model/maintenance';
import { PendingModel } from '../_model/pending';
import { VendorModel } from '../_model/vendor';
import { WarrantModel } from '../_model/warrant';
import { WorkModel } from '../_model/workOrder';

@Injectable({
  providedIn: 'root'
})

export class AssetCrudService {

 // private baseUrl = 'http://52.15.152.26:9096/api/assets'; 
  // http://52.15.152.26:9096
  isTblLoading = true;

  constructor(private http: HttpClient) { }

  // Asset Basic Crud
  getAssetsList(): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(`${environment.baseUrl}`+"/assetList");
  }

  getAsset(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}/${id}`);
  }

  // createAsset(asset: any): Observable<any> {
  //   return this.http.post(`${environment.baseUrl}`+"/addAssset", asset);
  // }

 
  createAsset(data: any): Observable<any> {
    const createAssetUrl = `${environment.baseGetUrl}'/api/ingredients/createIngredient`;
    return this.http.post(createAssetUrl, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateAsset( value: any): Observable<Object> {
    return this.http.put(`${environment.baseUrl}/update`, value);
  }

  deleteAsset(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/${id}`, { responseType: 'text' });
  }

//  Get select options
  getCategories(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/categories/get_categories`);
  }
  getDepartments(): Observable<any> {

    return this.http.get(`${environment.baseGetUrl}/department/getAllDepartments`);

  }

  getUnitMeasurement(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/unitMeasurement/getAllUnits`);
  }

  

  
  getCustodians(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/custodian/getCustodians`);
  }
  getLocations(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/location/locations`);
  }



  revaluateAsset(id: number, value: any): Observable<Object> {
    return this.http.post(`${environment.baseUrl}`+`/revaluate/${id}`, value);
  }

  transferAsset(id: number, value: any): Observable<Object> {
    return this.http.post(`${environment.baseUrl}`+`/transfer/${id}`, value);
  }

  disposeAsset(id: number, value: any): Observable<Object> {
    return this.http.post(`${environment.baseUrl}`+`/disposal/${id}`, value);
  }

  writeOffAsset(id: number, value: any): Observable<Object> {
    return this.http.post(`${environment.baseUrl}`+"/writeoff/"+`${id}`, value);
  }


  getPendingList(): Observable<PendingModel[]> {
    return this.http.get<PendingModel[]>(`${environment.baseUrl}`+"/pendingrequests");
  }



  //Insurance Crud
  addInsurance(id: string, insurance: InsuranceModel): Observable<any> {
    return this.http.post(`${environment.baseUrl}`+`/newInsurance/${id}`, insurance);
  }
  updateInsurance(id: number, insurance: InsuranceModel): Observable<InsuranceModel> {
    return this.http.put<InsuranceModel>(`${environment.baseUrl}`+`/updateinsurance/${id}`, insurance);
  }
  

  // Warranty Crud
  addWarranty(id: number, waranty: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}`+`/newWarranty/${id}`, waranty);
  } 
  updateWarranty(id: number, value: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}`+`/updatewarranty/${id}`, value);
  }
 
  // getWarranty(id: string): Observable<WarrantModel> {
  //   return this.http.get<WarrantModel>(`${environment.baseUrl}`+"/getWarranty/");
  // }

  // Work Crud
  addWork(id: number, work: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}`+`/newWorkorder/${id}`, work);
  }
  updateWork(id: number, value: WorkModel): Observable<WorkModel> {
    return this.http.put(`${environment.baseUrl}`+`/updateWorkorder/${id}`, value);
  }
  



  // Maintenance Crud
  addMaint(id: number, maint: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}`+`/newMaintenance/${id}`, maint);
  } 
  updateMaint(value: MaintModel): Observable<MaintModel> {
    return this.http.put(`${environment.baseUrl}/updateMaintenance`, value);
  }
  // /api/assets/getMaintenance/1
  getMaint(id: number): Observable<MaintModel[]> {
    return this.http.get<MaintModel[]>(`${environment.baseUrl}/getMaintenance/${id}`);
  }
  deleteMaint(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/maintenance/delete/${id}`, { responseType: 'text' });
  }
  
   


  // Vendor Crud 
  addVendor(id: number, vendor: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}`+`/newvendor/${id}`, vendor);
  }
  updateVendor(value: VendorModel): Observable<VendorModel> {
    return this.http.put(`${environment.baseUrl}`+"/updateVendor", value);
  }
  getVendor(id: number): Observable<VendorModel[]> {
    return this.http.get<VendorModel[]>(`${environment.baseUrl}`+`/getVendor/${id}`);
  }
  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/vendor/delete/${id}`, { responseType: 'text' });
  }

  //Depreciation
  // api/depreciation/{method}/{c}/{sv}/{y} //
  calcDepreciation(method: any, c: any, sv: any, y: any, rate: any, assetId: any): Observable<any> {
    return this.http.get(
      `${environment.baseGetUrl}/depreciation/${method}/${c}/${sv}/${y}/${rate}/${assetId}`);
  }
  // calcDepreciation(method: any, c: any, sv: any, y: any): Observable<any> {
  //   return this.http.post(`${environment.baseUrl}`+`/depreciation/${method}/${c}/${sv}/${y}`);
  // }

  getDepreciationsByAssetId(assetId): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/depreciation/asset/${assetId}`);
  }
  





  //Profit&Loss
  // /api/assets/disposal/records
  getProfitLoss(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/assets/disposal/records`);
  }

  // Get by 
  getByCategories(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/categories/assets`);
  }
  getByDepartments(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/departments/departmentunits/assets`);
  }
  getByLocations(): Observable<any> {
    return this.http.get(`${environment.baseGetUrl}/location/ward/assets`);
  }

  // http://3.13.214.62:1905/fixedassets/api/assets/1/qr

  // Get QR Code

  // getQrCode(id: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${environment.baseUrl}`+`/${id}/qr`);
  // }

  getImageQR(id: number): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}`+`/${id}/qr`, { responseType: 'blob' });
  }
  getImageBarCode(id: number): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/barcode/${id}`, { responseType: 'blob' });
  }

  
}
