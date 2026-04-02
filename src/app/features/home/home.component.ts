import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Wild-card route (or returning to home) should sign out existing login state as requested.
    this.auth.logout();
  }
}
