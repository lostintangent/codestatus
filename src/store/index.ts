import { observable } from "mobx";

export interface Status {
  emoji?: string;
  message?: string;
  indicatesLimitedAvailability?: boolean;
}

interface Store {
  isSignedIn: boolean;
  status: Status;
}

export const store: Store = observable({
  isSignedIn: false,
  status: {},
});
