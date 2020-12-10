import * as vscode from 'vscode';
import getCommandName from '../utils/getCommandName';
import Command from '../types/Command';
import { ECommand } from '../enum';
import release from './release';
import { getWorkspacePath } from '../utils/getWorkspacePath';
import { outputChannel } from '../tools/outputchannel';

const commands: Command[] = [
  {
    name: ECommand.Release,
    task: release
  },
  {
    name: ECommand.ReleaseAndPush,
    task: release,
    argList: [true]
  }
];



export default function registerCommands(context: vscode.ExtensionContext) {
  commands.forEach(command => {
    context.subscriptions.push(
      vscode.commands.registerCommand(getCommandName(command.name), async (...args: any[]) => {

        try {
          const workspacePath = await getWorkspacePath();
          if (workspacePath) {
            const argss: any[] = [workspacePath].concat(command.argList || [], args);
            await command.task(...argss);
          }
        } catch (error) {
          outputChannel.show();
          outputChannel.appendLine('出错了');
          outputChannel.appendLine(error?.message);
        }
      })
    );
  });
}