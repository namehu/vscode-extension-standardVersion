import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { outputChannel } from '../tools/outputchannel';

export default async function release(workspacePath: string, push = false) {

  const quickPickItems: vscode.QuickPickItem[] = [
    {
      label: 'patch',
      description: '小版本号发布',
      picked: true,
      detail: 'standard-version -r patch -n',
    },
    {
      label: 'minor',
      description: '中版本号发布',
      detail: "standard-version -r minor -n"
    },
    {
      label: 'major',
      description: '大版本号发布',
      detail: 'standard-version -r major -n'
    },
    {
      label: 'first-release',
      description: '初次生成changelog提交信息',
      detail: 'standard-version --first-release'
    },
    {
      label: 'alpha',
      description: 'alpha预发布版本',
      detail: 'standard-version -p alpha -n'
    },
    {
      label: 'beta',
      description: 'beta预发布版本',
      detail: 'standard-version -p beta -n'
    },
    {
      label: 'rc',
      description: 'rc预发布版本',
      detail: "standard-version -p rc -n"
    },
    {
      label: '指定版本号',
      description: '指定tag版本',
      detail: "standard-version --release-as x.x.x"
    }
  ];

  const packagePath = path.resolve(workspacePath, './package.json');

  let placeHolder = '请选择一个发布命令';
  try {
    const stat = fs.statSync(packagePath);
    if (stat.isFile()) {
      const { version } = JSON.parse(fs.readFileSync(packagePath).toString());
      if (version) {
        placeHolder += ` 当前版本为: v${version}`;
      }
    }
  } catch (error) {

  }

  const item = await vscode.window.showQuickPick(quickPickItems, { placeHolder });

  if (!item) {
    return;
  }

  let eCommand = item.detail!;

  if (item.label === '指定版本号') {
    const input = await vscode.window.showInputBox({
      placeHolder: '请输入版本号',
      prompt: '格式为1.0.0'
    });
    if (!input) {
      return;
    }

    if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(input)) {
      return vscode.window.showErrorMessage('输入版本号不合规');
    }

    eCommand = `standard-version --release-as ${input}`;
  }


  const { stdout } = await execCommand(eCommand, { cwd: workspacePath });

  let pushCommad = '';
  const info = stdout.replace(/ℹ Run \`(git push --follow-tags origin .+)\` to publish/gm, (m, p) => {
    if (push) {
      pushCommad = p;
      return '';
    }
    return m;
  });

  outputChannel.show();
  outputChannel.append(info);

  if (pushCommad) {
    const result = await execCommand(pushCommad, { cwd: workspacePath });
    outputChannel.append(result.stdout);
    if (result.stderr) {
      outputChannel.append(result.stderr);
    }
  }

}


function execCommand(command: string, option: { cwd: string }) {
  return new Promise<{
    stdout: string;
    stderr: string
  }>((resolve, reject) => {
    exec(command, option, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        stdout,
        stderr
      });
    });
  });
}