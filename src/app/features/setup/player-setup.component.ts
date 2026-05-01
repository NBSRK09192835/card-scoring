import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-player-setup',
  templateUrl: './player-setup.component.html',
  styleUrls: ['./player-setup.component.scss']
})
export class PlayerSetupComponent implements OnInit {

  username = '';

  players: string[] = [];
  selectedPlayers: string[] = [];

  newPlayer = '';

  loseOptions = [10, 20, 50, 100, 200, 300, 500, 1000];
  losePerHead = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private session: SessionFacade
  ) { }

  ngOnInit(): void {
    const routeUsername = this.route.snapshot.paramMap.get('username');
    const storedUsername = this.session.getUsername();

    if (routeUsername) {
      this.username = routeUsername;
      this.session.setUsername(routeUsername);
    } else if (storedUsername) {
      this.username = storedUsername;
    }

    const storedPlayers = this.session.getPlayers();

    if (!storedPlayers || storedPlayers.length === 0) {
      this.players = [
        'N.B.S.', 'Kiran', 'Deepu', 'Attagaru',
        'Babai', 'Chohi', 'Swetha', 'Pinni', 'Chaitu'
      ];
    } else {
      this.players = storedPlayers;
    }

    this.selectedPlayers = [];
  }

  togglePlayer(player: string): void {
    if (this.selectedPlayers.includes(player)) {
      this.selectedPlayers = this.selectedPlayers.filter(p => p !== player);
    } else {
      this.selectedPlayers.push(player);
    }
  }

  isSelected(player: string): boolean {
    return this.selectedPlayers.includes(player);
  }

  addPlayer(): void {
    const name = this.newPlayer.trim();

    if (!name) {
      this.toast.show('Enter a valid player name', 'error');
      return;
    }

    if (this.players.includes(name)) {
      this.toast.show('Player already exists', 'error');
      return;
    }

    this.players.push(name);
    this.session.setPlayers(this.players);

    this.selectedPlayers.push(name);

    this.newPlayer = '';

    this.toast.show('Player added successfully', 'success');
  }

  editUsername(): void {
    const updated = prompt('Enter new username', this.username);

    if (!updated || !updated.trim()) return;

    this.username = updated.trim();
    this.session.setUsername(this.username);

    this.toast.show('Username updated', 'success');
  }

  goBack(): void {
    this.session.clearSession();
    this.router.navigate(['/home']);
  }

  continue(): void {
    if (this.selectedPlayers.length < 2) {
      this.toast.show('Select at least 2 players', 'error');
      return;
    }

    this.session.setGameSetup({
      players: this.selectedPlayers,
      losePerHead: this.losePerHead,
      username: this.username
    });

    this.router.navigate([`/${this.username}/score`]);
  }

  removePlayer(player: string): void {
    this.selectedPlayers = this.selectedPlayers.filter(p => p !== player);
  }
}