import { namespace } from './../config';
import { window } from 'vscode';

const outputChannel = window.createOutputChannel(namespace);

outputChannel.appendLines = (infos: string[], newline = false) => {
  infos.forEach(info => {
    outputChannel.appendLine(`${info}`);
  });
  if (newline) {
    outputChannel.appendLine('');
  }
};

outputChannel.showAndAppendLines = (infos: string[], newline = false) => {
  outputChannel.show();
  outputChannel.appendLines(infos, newline);
};

outputChannel.log = (...infos: any[]) => {
  outputChannel.appendLine(infos.join(' '));
};



export {
  outputChannel,
};