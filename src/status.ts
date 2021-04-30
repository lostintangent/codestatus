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
        const statusSuffix = store.status?.indicatesLimitedAvailability
          ? " (Busy)"
          : "";

        statusBarItem.text = `$(github) ${store.status
          .message!}${statusSuffix}`;

        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    }
  );
}
