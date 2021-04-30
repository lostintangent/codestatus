import * as vscode from "vscode";
import { initializeApi } from "./api";
import { registerCommands } from "./commands";
import { registerStatusBar } from "./status";
import { AuthProvider } from "./store/auth";

export function activate(context: vscode.ExtensionContext) {
  const provider = new AuthProvider();

  registerCommands(context, provider);
  registerStatusBar();

  provider.initialize(context);

  return initializeApi(provider);
}
