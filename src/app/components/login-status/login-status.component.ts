import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string;
  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if(this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (result) => {
          this.userName = result.name;
          // get user email from authentication response and store it in browser storage
          const email = result.email;
          const lastName = result.family_name;
          const firstName = result.given_name;
          this.storage.setItem("userEmail", JSON.stringify(email));
          this.storage.setItem("lastName", JSON.stringify(lastName));
          this.storage.setItem("firstName", JSON.stringify(firstName));
        }
      );
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }

}
