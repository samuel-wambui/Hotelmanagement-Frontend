import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;
  error = "";
  loading = false; // <-- Loading flag
  successMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Set up the form with a custom validator for matching passwords.
    this.authForm = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        middleName: ["", Validators.required],
        // Note: Changed 'laststname' to 'lastname'. Adjust if needed.
        lastName: [""],
        phoneNumber: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
        email: [
          "",
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        password: ["", Validators.required],
        cpassword: ["", Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.authForm.controls;
  }

  // Custom validator to check that password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const cpassword = form.get("cpassword");
    if (password && cpassword && password.value !== cpassword.value) {
      cpassword.setErrors({ mismatch: true });
    } else {
      if (cpassword) {
        cpassword.setErrors(null);
      }
    }
    return null;
  }

 onSubmit() {
   this.submitted = true;
   // Stop if form is invalid
   if (this.authForm.invalid) {
     return;
   }
 
   // Set loading to true while the request is in progress
   this.loading = true;
 
   // Prepare registration data.
   const registrationData = {
  
     firstName: this.authForm.value.firstName,
     middleName: this.authForm.value.middleName,
     lastName: this.authForm.value.lastName, // Changed from laststname if needed
     phoneNumber: this.authForm.value.phoneNumber,
     email: this.authForm.value.email,
     password: this.authForm.value.password,
     roleIds: [0], // Default role ID
   };
 
   // Call the register method from AuthService.
   this.authService.register(registrationData).subscribe(
    (response) => {
      console.log("Registration response:", response);
      this.loading = false;
      // Check the payload's statusCode instead of response.status
      if (response.statusCode === 200) {
        this.successMessage = "Registration successful! Redirecting to account verification...";
        setTimeout(() => {
          this.router.navigate(['authentication/otp-verification'], { queryParams: { id: response.entity.id } });
        }, 3000);
      } else {
        // Use response.message to display the error
        this.error = response.message;
        setTimeout(() => {
          this.error = null;
        }, 4000);
        
      }
    },
    (error) => {
      console.error("Registration error:", error);
      this.error = error.error.message || 'An error occurred';
      this.loading = false;
    }
  );
 }
}  
