import { graphql } from "@octokit/graphql";
import * as vscode from "vscode";
import { refreshStatus } from "./actions";

const GITHUB_AUTH_PROVIDER_ID = "github";
const SCOPES = ["user"];

export class AuthProvider {
  private graphql: typeof graphql | undefined;

  async initialize(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(
      vscode.authentication.onDidChangeSessions(async (e) => {
        if (e.provider.id === GITHUB_AUTH_PROVIDER_ID) {
          await this.setGraphQL();
        }
      })
    );

    this.setGraphQL();
  }

  private async setGraphQL() {
    const session = await vscode.authentication.getSession(
      GITHUB_AUTH_PROVIDER_ID,
      SCOPES,
      { createIfNone: false }
    );

    if (session) {
      this.graphql = graphql.defaults({
        headers: {
          authorization: `token ${session.accessToken}`,
        },
      });

      return refreshStatus(this.graphql);
    }

    this.graphql = undefined;
  }

  async getOctokit(
    promptUser: boolean = true
  ): Promise<typeof graphql | undefined> {
    if (this.graphql) {
      return this.graphql;
    }

    const session = await vscode.authentication.getSession(
      GITHUB_AUTH_PROVIDER_ID,
      SCOPES,
      { createIfNone: promptUser }
    );

    if (!session) {
      return;
    }

    this.graphql = graphql.defaults({
      headers: {
        authorization: `token ${session.accessToken}`,
      },
    });

    return this.graphql;
  }
}
