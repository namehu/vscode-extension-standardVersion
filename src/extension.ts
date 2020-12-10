// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import command from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "standardversion" is now active!');

	let disposable = vscode.commands.registerCommand('standardversion.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from standardVersion!');
	});

	context.subscriptions.push(disposable);
	command(context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
