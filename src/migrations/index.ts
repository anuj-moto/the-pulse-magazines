import * as migration_20260522_203223_initial from './20260522_203223_initial';

export const migrations = [
  {
    up: migration_20260522_203223_initial.up,
    down: migration_20260522_203223_initial.down,
    name: '20260522_203223_initial'
  },
];
