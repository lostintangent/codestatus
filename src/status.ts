import { reaction } from "mobx";
import * as vscode from "vscode";
import { store } from "./store";

export function registerStatusBar() {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  statusBarItem.command = "codestatus.updateStatus";

  reaction(
    () => [store.status?.message, store.status?.indicatesLimitedAvailability],
    () => {
      if (store.status?.message) {
        statusBarItem.text = `$(github) ${store.status.message!}`;

        if (store.status?.indicatesLimitedAvailability) {
          statusBarItem.backgroundColor = new vscode.ThemeColor(
            "statusBarItem.errorBackground"
          );
          statusBarItem.tooltip = `${statusBarItem.text} (Busy)`;
        } else {
          statusBarItem.backgroundColor = undefined;
          statusBarItem.tooltip = undefined;
        }

        statusBarItem.text = `$(github) ${store.status.message!}`;
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    }
  );
}
