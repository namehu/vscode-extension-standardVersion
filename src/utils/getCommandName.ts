import { namespace } from './../config';
import { ECommand } from "../enum";

export default function getCommandName(command: ECommand) {
  return `${namespace}.${command}`;
}