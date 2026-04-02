import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-player-setup',
  templateUrl: './player-setup.component.html',
  styleUrls: ['./player-setup.component.scss']
})
export class PlayerSetupComponent implements OnInit {
  username = '';
  setupForm: FormGroup;
  availablePlayers = [
    'Alice',
    'Bob',
    'Charlie'
  ];

  playerDropdownOpen = false;
  showEditUsernameDialog = false;
  editUsernameValue = '';

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.setupForm = this.fb.group({
      selectedPlayers: [[], Validators.required],
      customPlayer: [''],
      lossPerHead: [10, Validators.required]
    });
  }

  ngOnInit(): void {
    // Prefer route username then auth service value, then localStorage fallback
    const routeUsername = this.route.snapshot.paramMap.get('username');
    const activeUsername = this.auth.getActiveUsername();
    const stored = localStorage.getItem('player-setup-username');
    this.username = routeUsername || activeUsername || stored || 'Guest';
    if (this.username) {
      localStorage.setItem('player-setup-username', this.username);
    }

    // Persist previously selected players (if coming back to this page)
    const storedPlayers = localStorage.getItem('player-setup-selected-players');
    if (storedPlayers) {
      const parsed = JSON.parse(storedPlayers) as string[];
      this.setupForm.get('selectedPlayers')?.setValue(parsed);
      parsed.forEach(name => {
        if (!this.availablePlayers.includes(name)) {
          this.availablePlayers.push(name);
        }
      });
    }

    const storedLoss = localStorage.getItem('player-setup-loss-per-head');
    if (storedLoss) {
      this.setupForm.get('lossPerHead')?.setValue(Number(storedLoss));
    }
  }

  get selectedPlayers(): string[] {
    return this.setupForm.get('selectedPlayers')?.value || [];
  }

  togglePlayerDropdown(): void {
    this.playerDropdownOpen = !this.playerDropdownOpen;
  }

  setPlayerSelection(player: string, checked: boolean): void {
    const selected = new Set(this.selectedPlayers);
    if (checked) {
      selected.add(player);
    } else {
      selected.delete(player);
    }

    const updated = Array.from(selected);
    this.setupForm.get('selectedPlayers')?.setValue(updated);
    localStorage.setItem('player-setup-selected-players', JSON.stringify(updated));
  }

  addCustomPlayer(): void {
    const custom = (this.setupForm.get('customPlayer')?.value || '').trim();
    if (!custom) {
      return;
    }

    if (!this.availablePlayers.map(p => p.toLowerCase()).includes(custom.toLowerCase())) {
      this.availablePlayers.push(custom);
    }

    this.setPlayerSelection(custom, true);
    this.setupForm.get('customPlayer')?.setValue('');
    this.playerDropdownOpen = false;
  }

  removePlayer(player: string): void {
    this.setPlayerSelection(player, false);
  }

  openEditUsername(): void {
    this.editUsernameValue = this.username;
    this.showEditUsernameDialog = true;
  }

  saveEditedUsername(): void {
    const edited = (this.editUsernameValue || '').trim();
    if (!edited) {
      return;
    }
    this.username = edited;
    localStorage.setItem('player-setup-username', this.username);
    this.showEditUsernameDialog = false;
  }

  cancelEditUsername(): void {
    this.showEditUsernameDialog = false;
  }

  continue(): void {
    const players = this.selectedPlayers;

    if (!players.length) {
      this.setupForm.get('selectedPlayers')?.setErrors({ required: true });
      this.setupForm.get('selectedPlayers')?.markAsTouched();
      return;
    }

    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }

    const lossPerHead = this.setupForm.value.lossPerHead;
    localStorage.setItem('player-setup-loss-per-head', String(lossPerHead));

    console.log('Continue configuration:', {
      username: this.username,
      selectedPlayers: players,
      lossPerHead
    });

    this.router.navigate(['/score'], {
      state: { username: this.username, selectedPlayers: players, lossPerHead }
    });
  }

  backToHome(): void {
    localStorage.setItem('player-setup-username', this.username);
    this.router.navigate(['/home']);
  }
}
