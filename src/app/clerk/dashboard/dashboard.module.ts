import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgApexchartsModule } from "ng-apexcharts";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "./../../shared/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { AssetsModule } from "../assets/assets.module";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    chartjsModule,
    NgApexchartsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
    ComponentsModule,
    SharedModule,
    AssetsModule
  ]
})
export class DashboardModule { }
