import { ECommand } from './../enum';

export default interface Command {
  name: ECommand;
  task: (...args: any) => any;
  argList?: any[],
}