import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-player-setup',
  templateUrl: './player-setup.component.html',
  styleUrls: ['./player-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerSetupComponent implements OnInit, OnDestroy {
  username = '';
  setupForm: FormGroup;
  availablePlayers = [
    'Alice',
    'Bob',
    'Charlie'
  ];
  lossOptions = [10, 20, 50, 100, 200, 300, 500];

  showEditUsernameDialog = false;
  editUsernameValue = '';
  dropdownOpen = false;
  lossDropdownOpen = false;
  private selectedPlayersSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private auth: AuthService, private elementRef: ElementRef) {
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

    this.selectedPlayersSubscription = this.setupForm.get('selectedPlayers')?.valueChanges.subscribe(value => {
      const selected = Array.isArray(value) ? value.filter(Boolean) as string[] : [];
      const sorted = [...new Set(selected)].sort((a, b) => a.localeCompare(b));
      if (JSON.stringify(sorted) !== JSON.stringify(selected)) {
        this.setupForm.get('selectedPlayers')?.setValue(sorted, { emitEvent: false });
      }
      localStorage.setItem('player-setup-selected-players', JSON.stringify(sorted));
    });
  }

  get selectedPlayers(): string[] {
    return this.setupForm.get('selectedPlayers')?.value || [];
  }

  get isAllSelected(): boolean {
    return this.availablePlayers.length > 0 && this.selectedPlayers.length === this.availablePlayers.length;
  }

  get isPartiallySelected(): boolean {
    return this.selectedPlayers.length > 0 && this.selectedPlayers.length < this.availablePlayers.length;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.lossDropdownOpen = false;
    }
  }

  toggleLossDropdown(): void {
    this.lossDropdownOpen = !this.lossDropdownOpen;
    if (this.lossDropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.lossDropdownOpen = false;
    }
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  onSelectAllChange(checked: boolean): void {
    if (checked) {
      this.setSelectedPlayers(this.availablePlayers);
    } else {
      this.setSelectedPlayers([]);
    }
  }

  onPlayerSelectionChange(player: string, checked: boolean): void {
    const selected = new Set(this.selectedPlayers);
    if (checked) {
      selected.add(player);
    } else {
      selected.delete(player);
    }

    const updated = Array.from(selected).sort((a, b) => a.localeCompare(b));
    this.setSelectedPlayers(updated);
  }

  private setSelectedPlayers(players: string[]): void {
    const updated = [...new Set(players)].sort((a, b) => a.localeCompare(b));
    this.setupForm.get('selectedPlayers')?.setValue(updated);
    localStorage.setItem('player-setup-selected-players', JSON.stringify(updated));
  }

  addCustomPlayer(): void {
    const custom = (this.setupForm.get('customPlayer')?.value || '').trim();
    if (!custom) {
      return;
    }

    if (!this.availablePlayers.map(p => p.toLowerCase()).includes(custom.toLowerCase())) {
      this.availablePlayers = [...this.availablePlayers, custom].sort((a, b) => a.localeCompare(b));
    }

    this.onPlayerSelectionChange(custom, true);
    this.setupForm.get('customPlayer')?.setValue('');
  }

  removePlayer(player: string): void {
    this.onPlayerSelectionChange(player, false);
  }

  selectLossOption(value: number): void {
    this.setupForm.get('lossPerHead')?.setValue(value);
    this.lossDropdownOpen = false;
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

    if (players.length < 2) {
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

  ngOnDestroy(): void {
    this.selectedPlayersSubscription?.unsubscribe();
  }
}
