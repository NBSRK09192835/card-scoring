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
  availablePlayers = [
    { content: 'Alice', selected: false },
    { content: 'Bob', selected: false },
    { content: 'Charlie', selected: false }
  ];

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

    const exists = this.availablePlayers.some(item => item.content.toLowerCase() === custom.toLowerCase());
    if (!exists) {
      this.availablePlayers = [...this.availablePlayers, { content: custom, selected: true }];
    }

    const selected = this.setupForm.get('selectedPlayers')?.value || [];
    if (!selected.some((item: { content: unknown; }) => item.content === custom)) {
      const updatedSelected = [...selected, { content: custom, selected: true }];
      this.setupForm.get('selectedPlayers')?.setValue(updatedSelected);
    }

    this.setupForm.get('customPlayer')?.setValue('');
  }


  continue(): void {
    const selectedPlayers = this.setupForm.value.selectedPlayers || [];

    if (!selectedPlayers || selectedPlayers.length === 0) {
      this.setupForm.get('selectedPlayers')?.setErrors({ required: true });
      this.setupForm.get('selectedPlayers')?.markAsTouched();
      return;
    }

    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }

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
