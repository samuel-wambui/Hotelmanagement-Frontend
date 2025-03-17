import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;


  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  authorities: string[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    console.log("onSubmit triggered with:", this.authForm.value);
    this.submitted = true;
    console.log("submitted")
    this.loading = true;
    this.error = "";

    //this.router.navigate(['/admin/dashboard'])

    // if(role == Role.Admin){
    //   this.router.navigate(['/admin/dashboard'])
    // }else if( role == Role.Clerk){
    //   this.router.navigate(['/clerk/dashboard'])
    // }else if( role == Role.Supervisor){
    //   this.router.navigate(['/supervisor/dashboard'])
    // }else if( role == Role.Executive){
    //   this.router.navigate(['/executive/dashboard'])
    // }else {
    //   this.error = "Invalid Login";
    // }

    console.log("this.authForm.value: ", this.authForm.value)

    if (this.authForm.invalid) {
      this.error = "email and Password not valid !";
      return;
    } else {
      this.authService.login(this.authForm.value).subscribe(
        res => {
          console.log(res)
          // Save the tokens
          this.tokenStorage.saveToken(res.entity.token); // Assuming 'token' is the JWT
          this.tokenStorage.saveUser(res);    // Save user information

      
          console.log("Saved Token:", this.tokenStorage.getToken());
      
          // Decode the JWT to extract the authorities
          const decodedToken: any = jwtDecode(res.entity.token);
          const authorities: string[] = decodedToken.authorities;
      
          console.log("Decoded Token:", decodedToken);
          console.log("Authorities:", authorities);
      
          if (!authorities || authorities.length === 0) {
            this.error = "No authorities found in token!";
            this.loading = false;
            return;
          }
      
          // Extract the user's role
          const role = authorities.includes('ROLE_SUPERUSER') ? Role.Admin
                     : authorities.includes('ROLE_CLERK') ? Role.Clerk
                     : authorities.includes('ROLE_SUPERVISOR') ? Role.Supervisor
                     : authorities.includes('ROLE_EXECUTIVE') ? Role.Executive
                     : null;
      
          // Navigate based on the role
          if (role === Role.Admin) {
            this.router.navigate(['/admin/dashboard']); ///admin/dashboard
          } else if (role === Role.Clerk) {
            this.router.navigate(['/clerk/dashboard']);
          } else if (role === Role.Supervisor) {
            this.router.navigate(['/supervisor/dashboard']);
          } else if (role === Role.Executive) {
            this.router.navigate(['/executive/dashboard']);
          } else {
            this.error = "Invalid Role!";
          }
      
          this.loading = false;
        },
        err => {
          console.error("Login Error:", err);
          this.error = err ||"Invalid Credentials!";
          this.submitted = false;
          this.loading = false;
        }
      );
    }
  }
}