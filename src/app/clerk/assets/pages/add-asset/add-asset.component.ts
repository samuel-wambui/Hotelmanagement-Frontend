import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { AssetCrudService } from "src/app/clerk/_services/assetcrud.service";
import { Router } from "@angular/router";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { map, Observable, Subscription } from "rxjs";
import { FilesUploadService } from "src/app/clerk/_services/files-upload.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CategoryLookupComponent } from "src/app/clerk/lease/lookups/category-lookup/category-lookup.component";
import { CategoryService } from "src/app/admin/data/services/category.service";
import { DepartmentLookupComponent } from "src/app/clerk/lease/lookups/department-lookup/department-lookup.component";
import { CustodianLookupComponent } from "src/app/clerk/lease/lookups/custodian-lookup/custodian-lookup.component";
import { LocationLookupComponent } from "src/app/clerk/lease/lookups/location-lookup/location-lookup.component";
import { Category } from "src/app/admin/data/types/category";
import { DepartmentResponse } from "src/app/admin/data/types/department";
import { FoodMeasurementUnitResponse } from "src/app/executive/data/types/foodMeasurementUnit";
import { FoodMeasurementUnitLookupComponent } from "src/app/clerk/lease/lookups/food-measurement-unit.ts/food-measurement units-lookup.component";

@Component({
  selector: "app-add-asset",
  templateUrl: "./add-asset.component.html",
  styleUrls: ["./add-asset.component.scss"],
})
export class AddAssetComponent implements OnInit {
  subscription!: Subscription;

  // categories = [
  //   { id: "1", name: "Furniture" },
  //   { id: "2", name: "Land" },
  //   { id: "3", name: "Buildings" },
  //   { id: "4", name: "Motor Vehicles" },
  //   { id: "5", name: "Computers" },
  //   { id: "6", name: "Computer Accessories" },
  //   { id: "7", name: "Equipment" },
  //   { id: "8", name: "Current Assets" },
  //   { id: "9", name: "Biological Assets" },
  // ];

  depreciations = [
    { name: "Straight line method" },
    { name: "Reducing balance method" },
  ];

  // types: string[] = ['Input 1', 'Make 2', 'Make 3']; // Add your makes here


  formControl = new FormControl("", [Validators.required]);

  // Stuff za File Upload//
  selectedFile?: File;
  progressInfos: any[] = [];
  message: string[] = [];
  fileInfos?: Observable<any>;
  progress:number=0

  formIsValid: any;
  loading:Boolean=false

  furSelected?: any;
  landSelected?: any;
  buSelected?: any;
  vehSelected?: any;
  compsSelected?: any;
  compsASelected?: any;
  equipSelected?: any;
  currSelected?: any;
  bioSelected?: any;

  docForm: FormGroup;
  hide3 = true;
  agree3 = false;
  currentUser: any;

  constructor(
    private snackbar: SnackbarService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private assetCrudService: AssetCrudService,
    private uploadService: FilesUploadService,
    private tokenStorageService: TokenStorageService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}
  showForm = false;
  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser().username;
    console.log("this.currentUser: ", this.currentUser);
    this.generateAssetForm();
    this.fileInfos = this.uploadService.getFiles();

    this.getCategories();
    this.getCustodians();
    this.getDepartments();
    this.getLocations();
    this.getUnitMeasurement();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toUpperCase(event:any){
    event.target.value=event.target.value.toUpperCase()

  }
  generateAssetForm() {
    this.docForm = this.fb.group({
      category: ["", [Validators.required]],
      category_fk: ["1", [Validators.required]],
      departmentUnit: ["", [Validators.required]],
      department_unit_fk: ["", [Validators.required]],
      location: ["", [Validators.required]],
      location_fk: ["", [Validators.required]],
      custodian: ["", [Validators.required]],
      food_name: ["", [Validators.required]],
      physicalAssetNo:["",[Validators.required]],
      cost: ["", [Validators.required]],
      depreciation_type: ["", [Validators.required]],
      acquisition_date: ["", [Validators.required]],
      depreciation_rate: ["", [Validators.required]],
      description: [""],
      //Other fields
      serialNo: [""],
      size: [""],
      regNo: [""],
      engineNo: [""],
      chasisNo: [""],
      localAuthority: [""],
      type: [""],
      model: [""],
      make: [""],
      remarks: [""],
      usageLifetime: [""],
      LRno: [""],
      doneBy: [this.currentUser],
    });

    this.showForm = true;
  }

  getCategoryById(event: any) {
    console.log("event :", event.value);
    if (event.value.id == "1") {
      this.furSelected = true;
    } else {
      this.furSelected = false;
    }
    if (event.value.id == "2") {
      this.landSelected = true;
    } else {
      this.landSelected = false;
    }
    if (event.value.id == "3") {
      this.buSelected = true;
    } else {
      this.buSelected = false;
    }
    if (event.value.id == "4") {
      this.vehSelected = true;
    } else {
      this.vehSelected = false;
    }
    if (event.value.id == "5") {
      this.compsSelected = true;
    } else {
      this.compsSelected = false;
    }
    if (event.value.id == "6") {
      this.compsASelected = true;
    } else {
      this.compsASelected = false;
    }
    if (event.value.id == "7") {
      this.equipSelected = true;
    } else {
      this.equipSelected = false;
    }
    if (event.value.id == "8") {
      this.currSelected = true;
    } else {
      this.currSelected = false;
    }
    if (event.value.id == "9") {
      this.bioSelected = true;
    } else {
      this.bioSelected = false;
    }
  }

  getSelectedDepartment(event: any) {
    console.log("event :", event.value);
    this.docForm.patchValue({
      department: event.value.departmentName,
      department_unit_fk: event.value.id,
    });
  }
  getSelectedLocation(event: any) {
    console.log("location :", event.value);
    this.docForm.patchValue({
      location: event.value.ward,
      location_fk: event.value.id,
    });
  }

  //Get error message
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }

  cancel() {
    this.location.back();
  }

  // Codes relating to upload File start
  // selectFiles(event): void {
  //   this.message = [];
  //   this.progressInfos = [];
  //   this.selectedFile = event.target.files[0];
  // }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  // onUpload() {
  //   if (this.selectedFile) {
  //     const uploadData = new FormData();
  //     uploadData.append('file', this.selectedFile, this.selectedFile.name);

  //     this.http.post('/api/upload', uploadData, {
  //       reportProgress: true,
  //       observe: 'events'
  //     })
  //     .subscribe(event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.progress = Math.round(100 * event.loaded / event.total!);
  //       } else if (event.type === HttpEventType.Response) {
  //         console.log('Upload complete');
  //       }
  //     });
  //   }
  // }
  // uploadFiles(): void {
  //   this.message = [];
  //   if (this.selectedFiles) {
  //     for (let i = 0; i < this.selectedFile.length; i++) {
  //       this.upload(i, this.selectedFiles[i]);
  //     }
  //   }
  // }
  // upload(idx: number, file: File): void {
  //   this.progressInfos[idx] = { value: 0, fileName: file.name };
  //   if (file) {
  //     this.uploadService.upload(file).subscribe({
  //       next: (event: any) => {
  //         if (event.type === HttpEventType.UploadProgress) {
  //           this.progressInfos[idx].value = Math.round(
  //             (100 * event.loaded) / event.total
  //           );
  //         } else if (event instanceof HttpResponse) {
  //           this.snackbar.showNotification(
  //             "snackbar-success",
  //             "Files uploaded successfully: "
  //           );
  //           const msg = "Uploaded the file successfully: " + file.name;
  //           this.message.push(msg);
  //           this.fileInfos = this.uploadService.getFiles();
  //           this.router.navigate(["/clerk/assets/all"]);
  //         }
  //       },
  //       error: (err: any) => {
  //         this.progressInfos[idx].value = 0;
  //         const msg = "Could not upload the file: " + file.name;
  //         this.message.push(msg);
  //         this.snackbar.showNotification("snackbar-danger", err + "!");
  //         this.fileInfos = this.uploadService.getFiles();
  //       },
  //     });
  //   }
  // }

  //  Submit Form

  validate() {
    console.log("Form Value", this.docForm.value);
    //console.log("Contents of form = "+this.assetForm.value);

    // Validate Other fields
    if (!this.docForm.value.category) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please enter category!"
      );
    } else if (this.docForm.value.category == "FoodStock") {
      if (!this.docForm.value.serialNo) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter Serial number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.type) {
        this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please enter type!");
        this.formIsValid = false;
      } else if (!this.docForm.value.description) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please Enter description!"
        );
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Land") {
      if (!this.docForm.value.LRno) {
        //this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter LR number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.size) {
        //this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please enter size!");
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Buildings") {
      if (!this.docForm.value.LRno) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter LR number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.size) {
        this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please enter size!");
        this.formIsValid = false;
      } else if (!this.docForm.value.type) {
        this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please Enter type!");
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Motor Vehicles") {
      if (!this.docForm.value.regNo) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter Registration number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.engineNo) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter Engine Number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.chasisNo) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter chasis number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.description) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter description!"
        );
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Computers") {
      if (!this.docForm.value.serialNo) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter Serial number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.make) {
        this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please enter make!");
        this.formIsValid = false;
      } else if (!this.docForm.value.description) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please Enter description!"
        );
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Computer Accessories") {
      if (!this.docForm.value.model) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter model!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.serialNo) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter Serial number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.description) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please Enter description!"
        );
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Equipment") {
      if (!this.docForm.value.make) {
        this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please enter make!");
        this.formIsValid = false;
      } else if (!this.docForm.value.description) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please Enter description!"
        );
        this.formIsValid = false;
      } else {
        this.onSubmit();
      }
    } else if (this.docForm.value.category == "Current Assets") {
    } else if (this.docForm.value.category == "Biological Assets") {
      if (!this.docForm.value.LRno) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please enter LR number!"
        );
        this.formIsValid = false;
      } else if (!this.docForm.value.type) {
        this.getErrorMessage();
        this.snackbar.showNotification("snackbar-danger", "Please enter type!");
        this.formIsValid = false;
      } else if (!this.docForm.value.description) {
        this.getErrorMessage();
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please Enter description!"
        );
        this.formIsValid = false;
      }else if(!this.selectedFile){
        this.snackbar.showNotification(
          "snackbar-danger",
          "Please Select Asset file!"
        );
      }
       else {
        this.onSubmit();
      }
    } else {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Invalid form details!"
      );
    }
  }

  onSubmit() {
    //this.upload();
    this.loading = true;
    console.log("Physical Asset Number "+this.docForm.value.physicalAssetNo)
    console.log("this.asset: ", this.docForm.value);
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);

      const assetData = this.docForm.value;
      uploadData.append('asset', new Blob([JSON.stringify(assetData)], { type: 'application/json' }));
      this.assetCrudService.createAsset(uploadData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total!);
          } else if (event.type === HttpEventType.Response) {
            console.log(event.body);
            this.loading=false
            this.snackbar.showNotification("snackbar-success",'Asset Registered Successfully');
            this.router.navigate(["/clerk/assets/all"]);

          }
        },
        (err) => {
          console.log(err);
          this.snackbar.showNotification('snackbar-danger','Asset Not Registered');
        }
      );
   
    // if (this.selectedFils) {
    //   this.uploadFiles();
    // } else {
    // }
  }

  import() {
    //console.log("clicked");
    this.router.navigate(["/clerk/assets/import"]);
  }

  categoryCode

  // *******************************************************************************************************************************************************************************
  //LookUps:

  categoryIsSelected = false;
  selectedCategories: any[] = [];
  categories: any;
  categoriesLookup() {
    console.log('categoriesLookup() called')
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      action: "view categories",
      data: this.categories,
      selected: this.selectedCategories,
    };

    const dialogRef = this.dialog.open(CategoryLookupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(" this is the results:>>>>>>> ", this.categories)
      if (result && result.data.length != 0) {
        console.log("result: ", result.data[0]);
 
        this.docForm.patchValue({
          category_fk: result.data[0].id,
          category: result.data[0].categoryName,
        });

        let event = { value: { id: result.data[0].id } };
        this.getCategoryById(event);

        console.log('categoryIsSelected set to true')
        this.categoryIsSelected = true;
      }
    });
  }

  departmentUnitsIsSelected = false;
  selectedDepartmentUnits: any[] = [];
  departments: DepartmentResponse;
  departmentUnitsLookup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      action: "view departmentunits",
      data: this.departments.entity,
      selected: this.selectedDepartmentUnits,
    };

    const dialogRef = this.dialog.open(DepartmentLookupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data.length != 0) {
        console.log("result: ", result.data[0]);

        this.docForm.patchValue({
          departmentUnit: result.data[0].departmentName,
          department_unit_fk: result.data[0].id,
        });

        this.categoryIsSelected = true;
      }
    });
  }

  UnitsIsSelected = false;
  selectedUnits: any[] = [];
  unit: FoodMeasurementUnitResponse;


  unitsMeasurementLookup() {
    if (!this.unit) {
      console.error("Unit is not defined. Ensure getUnitMeasurement() has completed.");
      return;
    }
  
    if (!this.unit.entity) {
      console.error("Unit entity is missing.");
      return;
    }
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      action: "view units",
      data: this.unit.entity,
      selected: this.selectedUnits,
    };
  
    const dialogRef = this.dialog.open(FoodMeasurementUnitLookupComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data.length !== 0) {
        console.log("result: ", result.data[0]);
  
        this.docForm.patchValue({
          departmentUnit: result.data[0].departmentName,
          department_unit_fk: result.data[0].id,
        });
  
        this.categoryIsSelected = true;
      }
    });
  }
  
  locationsIsSelected = false;
  selectedLocations: any[] = [];
  locations: any;
  locationsLookup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      action: "view locations",
      data: this.locations,
      selected: this.selectedLocations,
    };

    const dialogRef = this.dialog.open(LocationLookupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data.length != 0) {
        console.log("result: ", result.data[0]);

        this.docForm.patchValue({
          location: result.data[0].ward,
          location_fk: result.data[0].id,
        });

        this.locationsIsSelected = true;
      }
    });
  }

  custodianIsSelected = false;
  selectedCustodians: any[] = [];
  custodians: any;
  custodiansLookup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      action: "view custodians",
      data: this.custodians,
      selected: this.selectedCustodians,
    };

    const dialogRef = this.dialog.open(CustodianLookupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data.length != 0) {
        console.log("result: ", result.data[0]);

        this.docForm.patchValue({
          custodian: result.data[0].custodianName,
        });

        this.custodianIsSelected = true;
      }
    });
  }

 

  getCategories() {
    this.categoryService.getCategories()
      .pipe(map((res: any) => res.entity))
      .subscribe(
        (categories: Category[]) => {
          this.categories = categories;
          console.log("Fetched categories:", this.categories);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  
  
  getCustodians() {
    this.subscription = this.assetCrudService
      .getCustodians()
      .subscribe((res) => {
        this.custodians = res;
        console.log("All custodians =", this.custodians);
      });
  }
  getDepartments() {
    this.subscription = this.assetCrudService
      .getDepartments()
      .subscribe((res) => {
        console.log(res)
        this.departments = res;
        console.log("All departments in add asset =", this.departments);
      });
  }


  getUnitMeasurement() {
  this.subscription = this.assetCrudService.getUnitMeasurement().subscribe(
    (res) => {
      console.log("Response from API:", res);

      if (res) {
        this.unit = res; // Assign unit
      }

      console.log("Unit in add asset =", this.unit);
    },
    (error) => {
      console.error("Error fetching measurement unit:", error);
    }
  );
}

  





  getLocations() {
    this.subscription = this.assetCrudService
      .getLocations()
      .subscribe((res) => {
        this.locations = res;
        console.log("All locations =", this.locations);
      });
  }

  // *******************************************************************************************************************************************************************************

  assetLocation: string = "123 Main St, City, Country"; // Example asset location data

  getGoogleMapsUrl(): SafeResourceUrl {
    const encodedLocation = encodeURIComponent(this.assetLocation);
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedLocation}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(googleMapsUrl);
  }
}
