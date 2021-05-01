import * as vscode from "vscode";
import { store } from "./store";
import { setStatus } from "./store/actions";
import { AuthProvider } from "./store/auth";

export interface UserStatus {
  emoji?: string;
  expiresAt?: string;
  message?: string;
  limitedAvailability?: boolean;
}

export function initializeApi(provider: AuthProvider) {
  return {
    updateStatus: async (
      status: UserStatus
    ): Promise<vscode.Disposable | undefined> => {
      const octoKit = await provider.getOctokit(false);
      if (!octoKit) {
        return;
      }

      const previousStatus = {
        ...store.status,
      };

      await setStatus(octoKit, status);

      return {
        dispose() {
          setStatus(octoKit, previousStatus);
        },
      };
    },
  };
}
