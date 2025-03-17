import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  verificationCode: string = ''; // User input
  userId!: number; // Passed via queryParams
  error: string | null = null;
  successMessage: string | null = null;
  verificationSuccessful: boolean = false; 
  isSubmitting: boolean = false

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = +params['id']; // Get userId from queryParams
      console.log('User ID:', this.userId);
    });
  }

  verifyUser() {
    
    this.error = null;
    this.successMessage = null;
  
    
    if (!this.verificationCode) {
      console.error('Please enter a verification code!');
      this.error = 'Please enter a verification code!';
      return; 
    }
  
   
    this.isSubmitting = true;
  
    // Call the user service to verify the code
    this.authService.verifyCode(this.userId, this.verificationCode).subscribe({
      next: (response) => {
        console.log('Verification successful:', response);
  
        // Set success message and clear any previous errors
        this.successMessage = 'Verification successful!';
        this.error = null;
  
        // Delay for 3 seconds, then navigate to login page
        setTimeout(() => {
          this.successMessage = null; 
          this.isSubmitting = false; 
          this.verificationSuccessful = true; 
          this.router.navigate(['authentication/signin']);
        }, 2000);
      },
      error: (error) => {
        console.error('Verification failed:', error);
      
        // Use the error message from the response, or fall back to a default message
        this.error = error.message || 'Verification failed. Please try again.';
        this.successMessage = null; 
        this.verificationSuccessful = false;
      }
      
    });
  }
  
  
  }
