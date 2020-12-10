declare module 'vscode' {
  export namespace window {

  }

  export interface OutputChannel {
    appendLines(infos: string[], newline?: boolean): void;
    showAndAppendLines(infos: string[], newline?: boolean): void;
    log(...infos: any[]): void;
  }
}