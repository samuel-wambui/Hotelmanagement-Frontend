import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode

const TOKEN_KEY = 'token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  /**
   * Logs out the user by clearing localStorage.
   */
  signOut(): void {
    window.localStorage.clear();
    console.log('LocalStorage cleared.');
  }

  /**
   * Saves the JWT token to localStorage and decodes it to store user roles.
   * @param token - JWT token string
   */
  public saveToken(token: string): void {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided:', token);
      return;
    }
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
      console.log('Token Key Saved:', token); // Log the token key
      this.saveDecodedUser(token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  /**
   * Retrieves the stored JWT token.
   * @returns JWT token or null
   */
  public getToken(): string | null {
    try {
      const token = window.localStorage.getItem(TOKEN_KEY);
      console.log('Retrieved Token:', token); // Log the retrieved token
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Decodes the JWT token and extracts user authorities.
   * @param token - JWT token string
   */
  private saveDecodedUser(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // Log the decoded token data

      // Extract authorities (roles) and other details from the token payload
      const authorities = decodedToken?.authorities || [];
      const userData = {
        roles: authorities,
        username: decodedToken?.sub || '', // Assuming 'sub' is the username
        id: decodedToken?.id || null, // Assuming 'id' is the user ID
      };

      console.log('Decoded User Data:', userData); // Log the decoded user data
      this.saveUser(userData);
    } catch (error) {
      console.error('Error decoding token:', error);
      window.localStorage.removeItem(USER_KEY);
    }
  }

  /**
   * Saves user data to localStorage.
   * @param userResponse - User data object
   */
  public saveUser(userResponse: any): void {
    try {
      const user = {
        // Use the top-level username if available, otherwise fallback to entity.username
        username: userResponse.username || userResponse.entity?.username || '',
        id: userResponse.entity?.id || null,
        roles: userResponse.entity?.roles || [],
        token: userResponse.entity?.token || '',
      };
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log('User Key Saved:', user);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  } 
  
  /**
   * Retrieves user data from localStorage.
   * @returns User data object or null
   */
  public getUser(): any {
    try {
      const user = window.localStorage.getItem(USER_KEY);
      const parsedUser = user ? JSON.parse(user) : null;
      console.log('Retrieved User:', parsedUser);
      if (!Array.isArray(parsedUser.roles)) {
        console.error('Roles is not an array, resetting...');
        parsedUser.roles = [];
      }
      return parsedUser;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }
  

  /**
   * Retrieves the user's roles (authorities) from the stored data.
   * @returns An array of roles
   */
  public getAuthorities(): string[] {
    try {
      const user = this.getUser(); // Retrieve the current user
      const roles = user?.roles || []; // Get roles or default to an empty array
  
      // If roles are objects, map them to extract the 'authority' property
      const authorities = roles.map((role: any) => role.authority || role); // Handles both cases (objects or strings)
  
      console.log('Retrieved Authorities:', authorities); // Log the final array of authorities
      return authorities;
    } catch (error) {
      console.error('Error retrieving authorities:', error);
      return [];
    }
  }
  
  
}
