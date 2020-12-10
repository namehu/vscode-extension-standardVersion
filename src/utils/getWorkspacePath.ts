import * as vscode from 'vscode';

/**
 * 获取工作目录路径
 * 如果没有显示错误信息返回undefined
 * 如果只有一个直接返回
 * 如果有多个进行选择。返回选中的或是undefined
 */
export async function getWorkspacePath() {
  const { workspaceFolders } = vscode.workspace;

  if (!workspaceFolders) {
    vscode.window.showErrorMessage('当前没有打开的工作区');
    return;
  }

  if (workspaceFolders.length === 1) {
    return workspaceFolders[0].uri.path;
  }

  try {
    const item = await vscode.window.showWorkspaceFolderPick();
    if (item) {
      return item.uri.path;
    }
  } catch (error) {
  }

  return;

}