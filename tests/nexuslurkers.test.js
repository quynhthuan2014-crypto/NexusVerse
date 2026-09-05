import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, damageActor, fireWeapon, purchase, updateGame } from '../apps/nexuslurkers/game.js';

test('NexusLurkers state has a playable match shape', () => {
  const state = createGameState(123);
  assert.equal(state.version, 1);
  assert.equal(state.player.weapon, 'pistol');
  assert.equal(state.bots.length, 3);
  assert.equal(state.time, 600);
  assert.equal(state.pickups.length, 4);
});

test('armor absorbs part of incoming damage before health', () => {
  const actor = { armor: 50, hp: 100, flash: 0 };
  const dealt = damageActor(actor, 20);
  assert.equal(actor.armor, 39);
  assert.equal(actor.hp, 91);
  assert.equal(dealt, 9);
});

test('firing consumes magazine ammo and creates a projectile', () => {
  const state = createGameState(7);
  const before = state.player.weapons.pistol.mag;
  const fired = fireWeapon(state, state.player, 'pistol', 0);
  assert.equal(fired, true);
  assert.equal(state.player.weapons.pistol.mag, before - 1);
  assert.equal(state.projectiles.length, 1);
});

test('shop purchases spend coins and equip a new weapon', () => {
  const state = createGameState(9);
  state.player.coins = 100;
  assert.equal(purchase(state, 'burst'), true);
  assert.equal(state.player.weapon, 'burst');
  assert.equal(state.player.coins, 25);
});

test('zero delta update keeps state valid', () => {
  const state = createGameState(11);
  const before = state.time;
  updateGame(state, {up:false,down:false,left:false,right:false,sprint:false,fire:false,aim:false,mouseAngle:0,reload:false,shop:false}, 0);
  assert.equal(state.time, before);
  assert.ok(Number.isFinite(state.player.x));
});
