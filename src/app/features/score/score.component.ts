import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameService, Player, Round } from '../../core/services/game/game.service';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { DialogHostComponent } from '../../shared/dialog-host/dialog-host.component';
import html2canvas from 'html2canvas';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  username = '';
  today = '';

  players: Player[] = [];
  rounds: Round[] = [];
  totals: { [player: string]: number } = {};

  lossPerHead: number | null = null;
  lossOptions = [10, 20, 50, 100, 200, 300, 500, 1000];
  readonly defaultPlayers = [
    'N.B.S.', 'Kiran', 'Deepu', 'Attagaru',
    'Babai', 'Chohi', 'Swetha', 'Pinni', 'Chaitu'
  ];

  selectedWinner = '';

  @ViewChild('scorecard') scorecard!: ElementRef;

  constructor(
    private game: GameService,
    private session: SessionFacade,
    private toast: ToastService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.username = this.session.getUsername() || '';
    let names = this.session.getPlayers();

    if (!names || names.length === 0) {
      names = [...this.defaultPlayers];
      this.session.setPlayers(names);
    }

    if (names.length < 2) {
      this.toast.show('Please setup players first', 'error');
      this.router.navigate(['/home']);
      return;
    }

    this.game.setPlayers(names);
    this.players = this.game.getPlayers();
    this.lossPerHead = this.session.getLossPerHead();

    this.today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });

    this.refresh();
  }

  exportAsImage(): void {
    html2canvas(this.scorecard.nativeElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `${this.username}-scorecard.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  // ======================
  // UI HELPERS
  // ======================

  get activePlayers(): string[] {
    return this.game.getActivePlayers();
  }

  refresh(): void {
    this.rounds = this.game.getRounds();
    this.totals = this.game.getTotals();
  }

  // ======================
  // PLAYER TOGGLE
  // ======================

  togglePlayer(player: Player): void {
    const success = this.game.setPlayerActive(player.name, !player.active);

    if (!success) {
      this.toast.show('At least 2 active players required', 'error');
      return;
    }

    player.active = !player.active;
  }

  // ======================
  // ADD PLAYER
  // ======================

  addPlayer(): void {
    const dialogRef = this.dialog.open(DialogHostComponent, {
      data: {
        type: 'prompt',
        title: 'Add Player',
        message: 'Enter new player name',
        inputLabel: 'Player name',
        placeholder: 'Enter player name'
      }
    });

    dialogRef.afterClosed().subscribe(name => {
      const trimmedName = name?.trim();
      if (!trimmedName) return;

      this.game.addPlayer(trimmedName);

      this.players = this.game.getPlayers();
      this.refresh();
      this.toast.show(`Player ${trimmedName} added`, 'success');

      const currentRef = this.dialog.open(DialogHostComponent);
      currentRef.componentInstance.data = {
        type: 'confirm',
        title: 'Include in Current Round',
        message: `Include ${trimmedName} in the current round?`,
        confirmLabel: 'Yes',
        cancelLabel: 'No'
      };

      currentRef.afterClosed().subscribe(includeCurrent => {
        if (includeCurrent) {
          const lastRound = this.rounds[this.rounds.length - 1];
          if (lastRound && !lastRound.playersInRound.includes(trimmedName)) {
            lastRound.playersInRound.push(trimmedName);
            lastRound.results[trimmedName] = 0;
          }
        }
      });

      const nextRef = this.dialog.open(DialogHostComponent);
      nextRef.componentInstance.data = {
        type: 'confirm',
        title: 'Include in Next Rounds',
        message: `Include ${trimmedName} in future rounds?`,
        confirmLabel: 'Yes',
        cancelLabel: 'No'
      };

      nextRef.afterClosed().subscribe(includeNext => {
        if (includeNext) {
          this.game.setPlayerActive(trimmedName, true);
        }
      });
    });
  }

  // ======================
  // ADD ROUND
  // ======================

  addRound(): void {
    if (!this.lossPerHead) {
      this.toast.show('Select loss per head', 'error');
      return;
    }

    if (this.activePlayers.length < 2) {
      this.toast.show('At least 2 active players required', 'error');
      return;
    }

    const dialogRef = this.dialog.open(DialogHostComponent);
    dialogRef.componentInstance.data = {
      type: 'prompt',
      title: 'Select Winner',
      message: 'Choose the winner from active players',
      inputLabel: 'Winner',
      options: this.activePlayers
    };

    dialogRef.afterClosed().subscribe(winner => {
      if (!winner) return;

      const success = this.game.addRound(winner, this.lossPerHead as number);
      if (!success) {
        this.toast.show('Invalid winner selection', 'error');
        return;
      }

      this.refresh();
    });
  }

  // ======================
  // EDIT ROUND
  // ======================

  editRound(index: number): void {
    const round = this.rounds[index];

    const dialogRef = this.dialog.open(DialogHostComponent);
    dialogRef.componentInstance.data = {
      type: 'prompt',
      title: 'Update Winner',
      message: 'Select the winner for this round',
      inputLabel: 'Winner',
      options: round.playersInRound,
      defaultValue: round.winner
    };

    dialogRef.afterClosed().subscribe(winner => {
      if (!winner) return;

      const success = this.game.updateRound(index, winner);
      if (!success) {
        this.toast.show('Invalid winner', 'error');
        return;
      }

      this.refresh();
    });
  }

  // ======================
  // UI COLOR
  // ======================

  getValueClass(value: number): string {
    if (value > 0) return 'win';
    if (value < 0) return 'loss';
    return '';
  }

  async shareScore(): Promise<void> {
    const canvas = await html2canvas(this.scorecard.nativeElement);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'scorecard.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Scorecard',
          text: `${this.username}'s Scorecard`,
          files: [file]
        });
      } else {
        this.toast.show('Sharing not supported on this device', 'error');
      }
    });
  }
}