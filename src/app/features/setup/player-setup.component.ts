import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-player-setup',
  templateUrl: './player-setup.component.html',
  styleUrls: ['./player-setup.component.scss']
})
export class PlayerSetupComponent implements OnInit {
  username = '';
  setupForm: FormGroup;
  availablePlayers = ['A'];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.setupForm = this.fb.group({
      selectedPlayers: [[], Validators.required],
      customPlayer: [''],
      lossPerHead: [10, Validators.required]
    });
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') || 'Guest';
  }

  addCustomPlayer(): void {
    const custom = (this.setupForm.get('customPlayer')?.value || '').trim();
    if (!custom) {
      return;
    }

    if (!this.availablePlayers.includes(custom)) {
      this.availablePlayers = [...this.availablePlayers, custom];
    }

    const selected = this.setupForm.get('selectedPlayers')?.value || [];
    if (!selected.includes(custom)) {
      this.setupForm.get('selectedPlayers')?.setValue([...selected, custom]);
    }

    this.setupForm.get('customPlayer')?.setValue('');
  }

  continue(): void {
    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }

    const selectedPlayers = this.setupForm.value.selectedPlayers;
    const lossPerHead = this.setupForm.value.lossPerHead;

    console.log('Continue configuration:', {
      username: this.username,
      selectedPlayers,
      lossPerHead
    });

    // Persist selection if needed (future), then navigate.
    this.router.navigate(['/score']);
  }

  backToHome(): void {
    this.router.navigate(['/home']);
  }
}
