import { Router, NavigationEnd } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { ROUTES } from "./sidebar-items";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { TokenStorageService } from "src/app/core/service/token-storage.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.sass"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: any[] = [];
  level1Menu = "";
  level2Menu = "";
  level3Menu = "";
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  userFullName: string;
  userImg: string;
  userType: string;
  headerHeight = 60;
  currentRoute: string;
  routerObj = null;
 

  currentUser: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
    const body = this.elementRef.nativeElement.closest("body");
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currenturl = event.url.split("?")[0]; // Remove query parameters
        const urlSegments = currenturl.split("/").slice(1); // Remove the first empty segment
    
        console.log("Current URL Segments:", urlSegments);
    
        // Check if the first segment matches a known role
        const role = ["ROLE_SUPERUSER", "ROLE_CLERK"];
        const firstString = urlSegments[0]; // First part after domain
    
        if (role.indexOf(firstString) !== -1) {
          // If the role matches, set the level1Menu and level2Menu accordingly
          if (urlSegments.length > 2) {
            this.level1Menu = urlSegments[1]; // Second segment
            this.level2Menu = urlSegments[2]; // Third segment
          } else {
            // Handle case where there is no third segment
            this.level1Menu = urlSegments[1]; // Second segment
            this.level2Menu = "";
          }
        } else {
          // Handle the default case when role doesn't match
          if (urlSegments.length > 1) {
            this.level1Menu = urlSegments[0]; // First segment
            this.level2Menu = urlSegments[1]; // Second segment
          } else {
            // Handle case where there is no second segment
            this.level1Menu = urlSegments[0];
            this.level2Menu = "";
          }
        }
    
        // Optional: Close sidebar on mobile after selection
        this.renderer.removeClass(this.document.body, "overlay-open");
      }
    });
  }
  @HostListener("window:resize", ["$event"])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, "overlay-open");
    }
  }
  callLevel1Toggle(event: any, element: any) {
    
    if (element === this.level1Menu) {
      this.level1Menu = "0";
    } else {
      this.level1Menu = element;
    }

    const hasClass = event.target.classList.contains("toggled");
    if (hasClass) {
      this.renderer.removeClass(event.target, "toggled");
    } else {
      this.renderer.addClass(event.target, "toggled");
    }
  }

  

  callLevel2Toggle(event: any, element: any) {
    console.log(event);
    console.log("LEVEL TWO: " + this.level2Menu)
    if (element === this.level2Menu) {
      this.level2Menu = "0";
    } else {
      this.level2Menu = element;
    }

    console.log(this.level2Menu)
  }
  callLevel3Toggle(event: any, element: any) {
    if (element === this.level3Menu) {
      this.level3Menu = "0";
    } else {
      this.level3Menu = element;
    }
  }
  ngOnInit() {
    try {
      this.currentUser = this.tokenStorageService.getUser();
      const authorities = this.tokenStorageService.getAuthorities(); // Likely an array of strings
    
      // Log the current user and authorities
      console.log("Current User:", this.currentUser);
      console.log("Authorities:", authorities);
    
      // Check if authorities are valid
      if (Array.isArray(authorities) && authorities.length > 0) {
        const userRole = authorities[0]; // Access the first role string
        console.log('User Role:', userRole);
    
        const admin = Role.Admin;
        console.log("THIS IS ADMIN>>>>>>>>: " + admin);
    
        // Set user data
        this.userFullName = this.currentUser.username;
        this.userImg = "assets/images/user/profile_img.png";

        console.log('Sidebar Items:', this.sidebarItems);
        // Filter sidebar items based on the user role
        this.sidebarItems = ROUTES.filter((x) => x.role.indexOf(userRole) !== -1);
    
        // Set user type based on role
        switch (userRole) {
          case Role.Admin:
            this.userType = Role.Admin;
            break;
          case Role.Clerk:
            this.userType = Role.Clerk;
            break;
          case Role.Executive:
            this.userType = Role.Executive;
            break;
          case Role.Supervisor:
            this.userType = Role.Supervisor;
            break;
          default:
            console.warn('User role does not match any known roles.');
            this.userType = undefined; // Clear user type if no match
            break;
        }
      } else {
        console.error('Authorities array is invalid:', authorities);
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
    
  
    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  
  
  }
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + "";
    this.listMaxWidth = "500px";
  }
  isOpen() {
    return this.bodyTag.classList.contains("overlay-open");
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
    } else {
      this.renderer.removeClass(this.document.body, "ls-closed");
    }
  }
  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }
  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(["/authentication/signin"]);
    //window.location.reload();
  }
  // logout() {
  //   this.authService.logout().subscribe((res) => {
  //     if (!res.success) {
  //       this.router.navigate(["/authentication/signin"]);
  //     }
  //   });
  // }
}
