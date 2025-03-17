import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common'
@Component({
  selector: "app-page404",
  templateUrl: "./page404.component.html",
  styleUrls: ["./page404.component.scss"],
})
export class Page404Component implements OnInit {
  constructor(private location: Location) {}
  ngOnInit() {}

  back(): void {
    this.location.back()
  }
}
