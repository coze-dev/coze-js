import { type Command } from 'commander';

export type InstallAction = (program: Command) => void;
