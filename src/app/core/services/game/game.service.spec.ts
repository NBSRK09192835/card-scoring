import { TestBed } from '@angular/core/testing';
import { GameService, Player, Round } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Player Management', () => {
    it('should set players with active status', () => {
      const names = ['Player1', 'Player2', 'Player3'];
      service.setPlayers(names);
      const players = service.getPlayers();

      expect(players.length).toBe(3);
      expect(players[0].name).toBe('Player1');
      expect(players[0].active).toBe(true);
    });

    it('should get all players', () => {
      service.setPlayers(['Alice', 'Bob']);
      const players = service.getPlayers();

      expect(players.length).toBe(2);
      expect(players.map(p => p.name)).toEqual(['Alice', 'Bob']);
    });

    it('should get only active players', () => {
      service.setPlayers(['Alice', 'Bob', 'Charlie']);
      service.setPlayerActive('Bob', false);

      const activePlayers = service.getActivePlayers();
      expect(activePlayers).toEqual(['Alice', 'Charlie']);
    });

    it('should add a new player as inactive', () => {
      service.setPlayers(['Alice', 'Bob']);
      service.addPlayer('Charlie');

      const players = service.getPlayers();
      const charlie = players.find(p => p.name === 'Charlie');

      expect(charlie).toBeTruthy();
      expect(charlie?.active).toBe(false);
    });

    it('should not add duplicate player', () => {
      service.setPlayers(['Alice', 'Bob']);
      service.addPlayer('Alice');

      const players = service.getPlayers();
      expect(players.filter(p => p.name === 'Alice').length).toBe(1);
    });

    it('should activate a player', () => {
      service.setPlayers(['Alice', 'Bob']);
      service.addPlayer('Charlie');
      const success = service.setPlayerActive('Charlie', true);

      expect(success).toBe(true);
      const charlie = service.getPlayers().find(p => p.name === 'Charlie');
      expect(charlie?.active).toBe(true);
    });

    it('should deactivate a player when more than 2 active', () => {
      service.setPlayers(['Alice', 'Bob', 'Charlie']);
      const success = service.setPlayerActive('Bob', false);

      expect(success).toBe(true);
      const bob = service.getPlayers().find(p => p.name === 'Bob');
      expect(bob?.active).toBe(false);
    });

    it('should prevent deactivating when only 2 players remain active', () => {
      service.setPlayers(['Alice', 'Bob']);
      const success = service.setPlayerActive('Bob', false);

      expect(success).toBe(false);
      const bob = service.getPlayers().find(p => p.name === 'Bob');
      expect(bob?.active).toBe(true);
    });

    it('should return false when activating non-existent player', () => {
      service.setPlayers(['Alice', 'Bob']);
      const success = service.setPlayerActive('NonExistent', true);

      expect(success).toBe(false);
    });
  });

  describe('Round Management', () => {
    beforeEach(() => {
      service.setPlayers(['Alice', 'Bob', 'Charlie']);
    });

    it('should add a round with correct calculations', () => {
      const success = service.addRound('Alice', 50);

      expect(success).toBe(true);
      const rounds = service.getRounds();
      expect(rounds.length).toBe(1);

      const round = rounds[0];
      expect(round.winner).toBe('Alice');
      expect(round.lossPerHead).toBe(50);
      expect(round.playersInRound).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should calculate winner winnings correctly', () => {
      service.addRound('Alice', 50);
      const round = service.getRounds()[0];

      // 3 players, alice wins: 2 * 50 = 100
      expect(round.results['Alice']).toBe(100);
      expect(round.results['Bob']).toBe(-50);
      expect(round.results['Charlie']).toBe(-50);
    });

    it('should not add round with insufficient active players', () => {
      service.setPlayerActive('Bob', false);
      const success = service.addRound('Alice', 50);

      expect(success).toBe(false);
      expect(service.getRounds().length).toBe(0);
    });

    it('should not add round with non-existent winner', () => {
      const success = service.addRound('Nonexistent', 50);

      expect(success).toBe(false);
    });

    it('should not add round with inactive winner', () => {
      service.setPlayerActive('Alice', false);
      const success = service.addRound('Alice', 50);

      expect(success).toBe(false);
    });

    it('should not add round without loss per head', () => {
      const success = service.addRound('Alice', 0);

      expect(success).toBe(false);
    });

    it('should initialize all players in round results', () => {
      service.addRound('Alice', 50);
      const round = service.getRounds()[0];

      expect(round.results['Alice']).toBeDefined();
      expect(round.results['Bob']).toBeDefined();
      expect(round.results['Charlie']).toBeDefined();
    });
  });

  describe('Round Updates', () => {
    beforeEach(() => {
      service.setPlayers(['Alice', 'Bob', 'Charlie']);
      service.addRound('Alice', 50);
    });

    it('should update round winner', () => {
      const success = service.updateRound(0, 'Bob');

      expect(success).toBe(true);
      const round = service.getRounds()[0];
      expect(round.winner).toBe('Bob');
    });

    it('should recalculate winnings when updating winner', () => {
      service.updateRound(0, 'Bob');
      const round = service.getRounds()[0];

      expect(round.results['Bob']).toBe(100);
      expect(round.results['Alice']).toBe(-50);
    });

    it('should return false for invalid round index', () => {
      const success = service.updateRound(99, 'Alice');

      expect(success).toBe(false);
    });

    it('should return false when updating with non-participating player', () => {
      service.addPlayer('David');
      const success = service.updateRound(0, 'David');

      expect(success).toBe(false);
    });
  });

  describe('Totals Calculation', () => {
    beforeEach(() => {
      service.setPlayers(['Alice', 'Bob', 'Charlie']);
    });

    it('should calculate totals correctly for single round', () => {
      service.addRound('Alice', 50);
      const totals = service.getTotals();

      expect(totals['Alice']).toBe(100);
      expect(totals['Bob']).toBe(-50);
      expect(totals['Charlie']).toBe(-50);
    });

    it('should calculate totals correctly for multiple rounds', () => {
      service.addRound('Alice', 50);
      service.addRound('Bob', 50);

      const totals = service.getTotals();

      expect(totals['Alice']).toBe(50); // 100 - 50
      expect(totals['Bob']).toBe(50); // -50 + 100
      expect(totals['Charlie']).toBe(-100); // -50 - 50
    });

    it('should include all players in totals even with zero score', () => {
      service.addRound('Alice', 50);
      const totals = service.getTotals();

      expect(totals['Alice']).toBeDefined();
      expect(totals['Bob']).toBeDefined();
      expect(totals['Charlie']).toBeDefined();
    });
  });

  describe('Player Deactivation Effects', () => {
    beforeEach(() => {
      service.setPlayers(['Alice', 'Bob', 'Charlie', 'David']);
      service.addRound('Alice', 50);
    });

    it('should remove deactivated player from round', () => {
      service.setPlayerActive('Bob', false);
      const round = service.getRounds()[0];

      expect(round.playersInRound).not.toContain('Bob');
    });

    it('should set deactivated player result to zero for that round', () => {
      service.setPlayerActive('Bob', false);
      const round = service.getRounds()[0];

      expect(round.results['Bob']).toBe(-50);
    });

    it('should preserve total for deactivated player', () => {
      const totalsBefore = service.getTotals();
      service.setPlayerActive('Bob', false);
      const totalsAfter = service.getTotals();

      expect(totalsAfter['Bob']).toBe(totalsBefore['Bob']);
    });

    it('should recalculate winner winnings when player deactivated', () => {
      // Initial: 4 players, Alice wins 3 * 50 = 150
      let round = service.getRounds()[0];
      expect(round.results['Alice']).toBe(150);

      // Deactivate one player
      service.setPlayerActive('David', false);
      round = service.getRounds()[0];

      // Now: 3 players, Alice wins 2 * 50 = 100
      expect(round.results['Alice']).toBe(100);
    });

    it('should deactivate player who was the winner and adjust round', () => {
      service.setPlayerActive('Alice', false);
      const round = service.getRounds()[0];

      expect(round.playersInRound).not.toContain('Alice');
      expect(round.results['Alice']).toBe(0);
    });
  });

  describe('Reset Functionality', () => {
    beforeEach(() => {
      service.setPlayers(['Alice', 'Bob']);
      service.addRound('Alice', 50);
    });

    it('should clear all rounds', () => {
      service.reset();
      expect(service.getRounds().length).toBe(0);
    });

    it('should preserve players after reset', () => {
      service.reset();
      expect(service.getPlayers().length).toBe(2);
    });

    it('should have zero totals after reset', () => {
      service.reset();
      const totals = service.getTotals();

      expect(totals['Alice']).toBe(0);
      expect(totals['Bob']).toBe(0);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple players and rounds correctly', () => {
      service.setPlayers(['Alice', 'Bob', 'Charlie', 'David']);
      service.addRound('Alice', 100);
      service.addRound('Bob', 100);
      service.addRound('Charlie', 100);

      const totals = service.getTotals();

      // Alice: 300 - 100 - 100 = 100
      expect(totals['Alice']).toBe(100);
      // Bob: -100 + 300 - 100 = 100
      expect(totals['Bob']).toBe(100);
      // Charlie: -100 - 100 + 300 = 100
      expect(totals['Charlie']).toBe(100);
      // David: -100 - 100 - 100 = -300
      expect(totals['David']).toBe(-300);
    });

    it('should handle adding and removing players mid-game', () => {
      service.setPlayers(['Alice', 'Bob']);
      service.addRound('Alice', 50);
      
      service.addPlayer('Charlie');
      service.setPlayerActive('Charlie', true);
      service.addRound('Bob', 50);

      const totals = service.getTotals();
      expect(totals['Alice']).toBe(-50);
      expect(totals['Bob']).toBe(100);
      expect(totals['Charlie']).toBe(-50);
    });
  });
});
