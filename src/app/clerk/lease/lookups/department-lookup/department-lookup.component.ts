import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ManageLeasesComponent } from '../../manage-leases/manage-leases.component';

@Component({
  selector: 'app-department-lookup',
  templateUrl: './department-lookup.component.html',
  styleUrls: ['./department-lookup.component.sass']
})
export class DepartmentLookupComponent implements OnInit {

  

  displayedColumns: string[] = [
    "select",
    "id",
    "departmentCode",
    "departmentName",
      
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;

  selection = new SelectionModel<any>(false, []);

  supplierDetails: any;
  selectedRows: any[] = [];
  atleastOneSelected: boolean = false;

  dataSourceFilteredList: any[] = [];
  suppliersArray: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ManageLeasesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.supplierDetails = this.data.data;
    this.suppliersArray = this.data.selected;

    console.log("this.suppliers: ", this.supplierDetails);

    this.dataSource = new MatTableDataSource<any>(this.supplierDetails);
    this.dataSource.sort = this.sort;

    if (this.suppliersArray.length !== 0) {
      this.filter();
      console.log("filter by: ", this.suppliersArray);
    }
  }
  ngAfterViewInit() {
    
    console.log("Finally: ", this.dataSourceFilteredList);

    this.dataSource.paginator = this.paginator;
  }

  filter() {
    //let storeId = [1, 2, 3];
    this.dataSource.data.forEach((element) => {
      this.suppliersArray.forEach((item) => {
        if (item === element.id) {
          // this.dataSourceFilteredList.push(this.dataSource.data.indexOf(element));
          this.selection.select(element);
        }
      });
    });

    console.log("dataSourceFilteredList ", this.dataSourceFilteredList);
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //******************************************************************************************************
  //Select expense

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }

  expSelected() {
    this.atleastOneSelected = true;
    this.selectedRows = this.selection.selected;

    console.log("this.selectedRows: ", this.selectedRows);
  }
  proceed() {
    this.dialogRef.close({ event: "close", data: this.selectedRows });

    //   console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close({ event: "close", data: this.selectedRows });
  }
  public confirmAdd(): void {}

}
