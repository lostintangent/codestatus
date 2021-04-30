import * as vscode from "vscode";
import { store } from "./store";
import { setStatus } from "./store/actions";
import { AuthProvider } from "./store/auth";

export interface UserStatus {
  message?: string;
  limitedAvailability?: boolean;
}

export function initializeApi(provider: AuthProvider) {
  return {
    updateStatus: async (status: UserStatus): Promise<vscode.Disposable> => {
      const octoKit = await provider.getOctokit();
      const previousStatus = store.status;
      await setStatus(octoKit, status);
      return {
        dispose: () => {
          setStatus(octoKit, previousStatus);
        },
      };
    },
  };
}
