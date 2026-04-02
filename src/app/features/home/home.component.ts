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
    // preserve guest state while logging out non-guest user
    this.auth.saveGuestToLocal();
    this.auth.logout();
  }
}
