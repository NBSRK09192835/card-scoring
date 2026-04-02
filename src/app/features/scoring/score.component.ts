import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  username = '';

  players = [
    { name: 'Alice', score: 0 },
    { name: 'Bob', score: 0 },
    { name: 'Charlie', score: 0 }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.auth.getActiveUsername() || 'Guest';
  }

  backToHome(): void {
    this.router.navigate(['/home']);
  }

  applyScores(): void {
    console.log('Applying scores for', this.username, this.players);
    // placeholder behavior
  }
}
