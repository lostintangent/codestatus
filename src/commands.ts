import { commands, ExtensionContext, window } from "vscode";
import { EXTENSION_NAME } from "./constants";
import { store } from "./store";
import { setStatus } from "./store/actions";
import { AuthProvider } from "./store/auth";

export function registerCommands(
  context: ExtensionContext,
  provider: AuthProvider
) {
  context.subscriptions.push(
    commands.registerCommand(`${EXTENSION_NAME}.updateStatus`, async () => {
      const message = await window.showInputBox({
        value: store.status?.message,
      });

      if (message) {
        const octoKit = await provider.getOctokit();
        setStatus(octoKit!, { message });
      }
    })
  );

  const setAvailability = async (limitedAvailability: boolean) => {
    const octoKit = await provider.getOctokit();
    setStatus(octoKit!, { limitedAvailability });
  };

  context.subscriptions.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.markBusy`,
      setAvailability.bind(null, true)
    )
  );

  context.subscriptions.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.markAvailable`,
      setAvailability.bind(null, false)
    )
  );
}
