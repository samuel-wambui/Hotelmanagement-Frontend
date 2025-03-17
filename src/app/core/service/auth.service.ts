import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError, tap } from "rxjs/operators";
import { TokenStorageService } from "./token-storage.service"; // Import TokenStorageService
import { Auth } from "../models/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  login(user: any): Observable<any> {
    const url = `${environment.apiUrl}/api/auth/login`;
    console.log("Making HTTP request to:", url);
    console.log("Login request payload:", user);

    return this.http.post<Auth>(url, user, {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(
      tap((response) => {
        console.log("Response received:", response);

        // Save token to TokenStorageService inside tap
        if (response?.entity?.token) {
          this.tokenStorage.saveToken(response.entity.token);
          console.log("Token saved:", response.entity.token);
          this.tokenStorage.saveUser(response.entity); // Optionally save user details
          console.log("User details saved.");
        } else {
          console.error("No token found in response.");
        }
      }),
      catchError((error) => {
        console.error("Error occurred:", error);
        return of(null);  // Return a fallback observable to handle errors gracefully
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    const forgotPasswordUrl = `${environment.apiUrl}/api/auth/forgotPassword${email}`;
    return this.http.post<{ message: string }>(forgotPasswordUrl, {});
  }

  resetPassword(passwordDetails: any): Observable<{ message: string }> {
    const resetPasswordUrl = `${environment.apiUrl}/reset/change-password`;
    return this.http.post<{ message: string }>(resetPasswordUrl, passwordDetails);
  }

register(user: any): Observable<any> {
  const url = `${environment.apiUrl}/api/auth/register`;
  console.log("Making HTTP request to:", url);
  console.log("Registration request payload:", user);

  return this.http.post<Auth>(url, user, {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  }).pipe(
    tap((response) => {
      console.log("Registration response received:", response);
      // If the registration response includes a token, save it
      if (response?.token) {
        this.tokenStorage.saveToken(response.token);
        console.log("Token saved:", response.token);
        // Optionally, save user details if returned (for example, in response.employee)
        this.tokenStorage.saveUser(response.employee);
        console.log("User details saved.");
      }
    }),
    catchError((error) => {
      console.error("Registration error occurred:", error);
      return throwError(error);
    })
  );
}
verifyCode(id: number, verificationCode: string): Observable<any> {
  
  if (id == null || verificationCode == null || verificationCode.trim() === '') {
    console.error('Invalid input: ID and verification code are required.');
    return throwError(() => ({
      message: 'Invalid input: ID and verification code are required.',
      statusCode: 400
    }));
  }

  const body = { verificationCode, id };
  console.log('Payload being sent to backend:', body);

  try {
    const verificationUrl = `${environment.apiUrl}/api/auth/verify`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(verificationUrl, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error object:', error);
        return throwError(() => ({
          message: error.error?.message || 'Verification failed. Please try again.',
          statusCode: error.status || 500
        }));
      })
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return throwError(() => ({
      message: 'An unexpected error occurred. Please try again later.',
      statusCode: 500
    }));
  }
}
}