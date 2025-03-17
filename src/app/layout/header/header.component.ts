import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/account/data/services/notifications.service";
import { ConfigService } from "src/app/config/config.service";
import { AuthService } from "src/app/core/service/auth.service";
import { LanguageService } from "src/app/core/service/language.service";
import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { untilDestroyed } from "src/app/shared/custom-components/Extras/operators";
const document: any = window.document;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.sass"],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, AfterViewInit
{
  public config: any = {};
  userImg: string;
  homePage: string;
  isNavbarCollapsed = true;
  flagvalue;
  countryName;
  langStoreValue: string;
  defaultFlag: string;
  isOpenSidebar: boolean;
  userName: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService
  ) {
    super();
  }
  listLang = [
    { text: "English", flag: "assets/images/flags/us.jpg", lang: "en" },
    { text: "Spanish", flag: "assets/images/flags/spain.jpg", lang: "es" },
    { text: "German", flag: "assets/images/flags/germany.jpg", lang: "de" },
  ];

  notifications: any[] = [
    {
      message: "Please check your mail",
      time: "14 mins ago",
      icon: "mail",
      color: "nfc-green",
      status: "msg-unread",
    },
    {
      message: "New Employee Added..",
      time: "22 mins ago",
      icon: "person_add",
      color: "nfc-blue",
      status: "msg-read",
    },
    {
      message: "Your leave is approved!! ",
      time: "3 hours ago",
      icon: "event_available",
      color: "nfc-orange",
      status: "msg-read",
    },
    {
      message: "Lets break for lunch...",
      time: "5 hours ago",
      icon: "lunch_dining",
      color: "nfc-blue",
      status: "msg-read",
    },
    {
      message: "Employee report generated",
      time: "14 mins ago",
      icon: "description",
      color: "nfc-green",
      status: "msg-read",
    },
    {
      message: "Please check your mail",
      time: "22 mins ago",
      icon: "mail",
      color: "nfc-red",
      status: "msg-read",
    },
    {
      message: "Salary credited...",
      time: "3 hours ago",
      icon: "paid",
      color: "nfc-purple",
      status: "msg-read",
    },
  ];

  ngOnInit() {
    // Safely retrieve config data
    this.config = this.configService?.configData || {};
  
    // Safely retrieve user data
    const user = this.tokenStorage.getUser();
  
    // Initialize default values for user information
    this.userName = 'Unknown User';
    this.userImg = "assets/images/user/default_img.png"; // Default fallback image
    this.homePage = "page-not-found"; // Default fallback
  
    // Check if user exists
    if (user) {
      this.userName = user.username || this.userName; // Use fallback if username is missing
      this.userImg = "assets/images/user/profile_img.png"; // Set user image
  
      // Retrieve roles safely from the user object
      const userRoles = this.tokenStorage.getAuthorities(); // Get roles using TokenStorageService
      console.log('Retrieved Roles:', userRoles);
  
      if (Array.isArray(userRoles) && userRoles.length > 0) {
        const userRole = userRoles[0]; // Access the first role safely
        console.log('User Role:', userRole);
  
        // Map userRole to the appropriate homePage
        switch (userRole) {
          case "ROLE_SUPERUSER":
            this.homePage = "admin/dashboard";
            break;
          case "ROLE_CLERK":
            this.homePage = "clerk/dashboard";
            break;
          case "ROLE_EXECUTIVE":
            this.homePage = "executive/dashboard";
            break;
          case "ROLE_SUPERVISOR":
            this.homePage = "supervisor/dashboard";
            break;
          default:
            console.warn("Unrecognized role:" + userRole);
            this.homePage = "page-not-found";
        }
      } else {
        console.warn("No authorities found for the user.");
        this.homePage = "page-not-found"; // Fallback if no roles exist
      }
    } else {
      console.warn("No user data found.");
    }
  
  

    this.langStoreValue = localStorage.getItem("lang");
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = "assets/images/flags/us.jpg";
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  ngAfterViewInit() {
    // set theme on startup
    if (localStorage.getItem("theme")) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem("theme"));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }

    if (localStorage.getItem("menuOption")) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem("menuOption")
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        "menu_" + this.config.layout.sidebar.backgroundColor
      );
    }

    if (localStorage.getItem("choose_logoheader")) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem("choose_logoheader")
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        "logo-" + this.config.layout.logo_bg_color
      );
    }

    if (localStorage.getItem("sidebar_status")) {
      if (localStorage.getItem("sidebar_status") === "close") {
        this.renderer.addClass(this.document.body, "side-closed");
        this.renderer.addClass(this.document.body, "submenu-closed");
      } else {
        this.renderer.removeClass(this.document.body, "side-closed");
        this.renderer.removeClass(this.document.body, "submenu-closed");
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, "side-closed");
        this.renderer.addClass(this.document.body, "submenu-closed");
      }
    }
  }
  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    } else {
      this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }



  closeNotification(){

  }

getNotifications(){

  // this.notificationService.getAllNotifications.pipe(
  //   untilDestroyed(this)
  // ).subscribe({
  //   next: (res) => {
  //     if (res.statusCode == 201) {
  //       this.snackbar.showNotification("snackbar-success", res.message);
  //       this.router.navigate(["/clerk/leases/all-lessors"]);
  //     } else {
  //       this.snackbar.showNotification("snackbar-danger", res.message);
  //     }
  //   },
  //   error: (err) => {
  //     this.snackbar.showNotification("snackbar-danger", "Server Error: !!");
  //   },
  //   complete: () => {
  
  //   }
  // });

}
  
  


  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(["/authentication/signin"]);
    //window.location.reload();
  }
  // logout() {
  //   this.subs.sink = this.authService.logout().subscribe((res) => {
  //     if (!res.success) {
  //       this.router.navigate(["/authentication/signin"]);
  //     }
  //   });
  // }
}
