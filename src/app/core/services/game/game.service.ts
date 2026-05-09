import { Injectable } from '@angular/core';

export type Player = {
    name: string;
    active: boolean;
};

export type Round = {
    winner: string;
    lossPerHead: number;
    playersInRound: string[];
    results: { [player: string]: number };
};

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private players: Player[] = [];
    private rounds: Round[] = [];

    // ======================
    // PLAYER MANAGEMENT
    // ======================

    setPlayers(names: string[]): void {
        this.players = names.map(name => ({
            name,
            active: true
        }));
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getActivePlayers(): string[] {
        return this.players
            .filter(p => p.active)
            .map(p => p.name);
    }

    addPlayer(name: string): void {
        if (this.players.find(p => p.name === name)) return;

        this.players.push({
            name,
            active: false // default inactive until dialog decides
        });
    }

    setPlayerActive(name: string, active: boolean): boolean {
        const player = this.players.find(p => p.name === name);
        if (!player) return false;

        const activeCount = this.getActivePlayers().length;

        // Prevent going below 2 active players
        if (!active && activeCount <= 2) {
            return false;
        }

        player.active = active;

        // If deactivating a player, remove them from all rounds and update totals
        if (!active) {
            this.updateRoundsForInactivePlayer(name);
        }

        return true;
    }

    // When a player becomes inactive, remove them from existing rounds
    // but preserve their previous total
    private updateRoundsForInactivePlayer(playerName: string): void {
        this.rounds.forEach(round => {
            if (round.playersInRound.includes(playerName)) {
                // Remove player from this round
                round.playersInRound = round.playersInRound.filter(p => p !== playerName);

                // Recalculate the winner's winnings based on updated player count
                if (round.playersInRound.includes(round.winner)) {
                    const newWinAmount = (round.playersInRound.length - 1) * round.lossPerHead;
                    round.results[round.winner] = newWinAmount;

                    // Recalculate losers' amounts
                    round.playersInRound.forEach(player => {
                        if (player !== round.winner) {
                            round.results[player] = -round.lossPerHead;
                        }
                    });
                } else {
                    // If winner is deactivated, set their result to 0
                    round.results[round.winner] = 0;
                }
            }
        });
    }

    // ======================
    // ROUND MANAGEMENT
    // ======================

    getRounds(): Round[] {
        return this.rounds;
    }

    addRound(winner: string, lossPerHead: number): boolean {
        const activePlayers = this.getActivePlayers();

        if (activePlayers.length < 3) return false;
        if (!activePlayers.includes(winner)) return false;
        if (!lossPerHead) return false;

        const results: { [player: string]: number } = {};

        const winAmount = (activePlayers.length - 1) * lossPerHead;

        // Initialize all players to 0
        this.players.forEach(p => {
            results[p.name] = 0;
        });

        // Apply round results
        activePlayers.forEach(player => {
            if (player === winner) {
                results[player] = winAmount;
            } else {
                results[player] = -lossPerHead;
            }
        });

        this.rounds.push({
            winner,
            lossPerHead,
            playersInRound: [...activePlayers],
            results
        });

        return true;
    }

    // ======================
    // EDIT ROUND
    // ======================

    updateRound(index: number, newWinner: string): boolean {
        const round = this.rounds[index];
        if (!round) return false;

        const { playersInRound, lossPerHead } = round;

        if (!playersInRound.includes(newWinner)) return false;

        const results: { [player: string]: number } = {};

        const winAmount = (playersInRound.length - 1) * lossPerHead;

        // Reset all players to 0
        this.players.forEach(p => {
            results[p.name] = 0;
        });

        // Recalculate
        playersInRound.forEach(player => {
            if (player === newWinner) {
                results[player] = winAmount;
            } else {
                results[player] = -lossPerHead;
            }
        });

        // Replace round completely
        this.rounds[index] = {
            winner: newWinner,
            lossPerHead,
            playersInRound: [...playersInRound],
            results
        };

        return true;
    }

    // ======================
    // TOTALS
    // ======================

    getTotals(): { [player: string]: number } {
        const totals: { [player: string]: number } = {};

        this.players.forEach(p => {
            totals[p.name] = 0;
        });

        this.rounds.forEach(round => {
            Object.keys(round.results).forEach(player => {
                totals[player] += round.results[player] || 0;
            });
        });

        return totals;
    }

    // ======================
    // RESET
    // ======================

    reset(): void {
        this.rounds = [];
    }
}