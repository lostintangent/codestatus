import { graphql } from "@octokit/graphql";
import { set } from "mobx";
import { commands } from "vscode";
import { Status, store } from ".";
import { UserStatus } from "../api";

const STATUS_QUERY = `status {
  emoji
  expiresAt
  message
  indicatesLimitedAvailability
}`;

export async function refreshStatus(octoKit: typeof graphql) {
  const {
    viewer: { status = {} as Status },
  } = await octoKit(`{
      viewer {
        ${STATUS_QUERY}
      }
    }`);

  commands.executeCommand(
    "setContext",
    "codestatus:isBusy",
    !!status.indicatesLimitedAvailability
  );

  set(store.status, status);
}

export async function setStatus(
  octoKit: typeof graphql,
  newStatus: UserStatus
) {
  if (
    newStatus.message === undefined &&
    newStatus.limitedAvailability !== undefined
  ) {
    // The user's profile can't have a busy status
    // without a message. So if the user doesn't
    // have a message, then we need to set one.
    newStatus.message =
      store.status.message ||
      (newStatus.limitedAvailability === false
        ? "Will be slow to respond"
        : "");
  } else if (
    newStatus.limitedAvailability === undefined &&
    store.status.indicatesLimitedAvailability
  ) {
    // The GitHub API will default the busy status to false, so we need
    // to check whether the user is busy and if so, reset it on the call.
    newStatus.limitedAvailability = true;
  }

  const {
    changeUserStatus: { status = {} as Status },
  } = await octoKit(
    `mutation ($status: ChangeUserStatusInput!) {
        changeUserStatus(input: $status) {
          ${STATUS_QUERY}
        }
      }`,
    {
      status: newStatus,
    }
  );

  commands.executeCommand(
    "setContext",
    "codestatus:isBusy",
    status.indicatesLimitedAvailability
  );

  set(store.status, status);
}
