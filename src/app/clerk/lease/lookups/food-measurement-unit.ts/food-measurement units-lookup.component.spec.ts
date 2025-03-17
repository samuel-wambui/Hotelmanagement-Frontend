import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodMeasurementUnitLookupComponent } from './food-measurement units-lookup.component';



describe('DepartmentLookupComponent', () => {
  let component: FoodMeasurementUnitLookupComponent;
  let fixture: ComponentFixture<FoodMeasurementUnitLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodMeasurementUnitLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodMeasurementUnitLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
