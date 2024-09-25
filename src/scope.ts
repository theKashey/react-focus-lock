import { createContext } from "react";
import { Shards } from "./interfaces";

export const focusScope = createContext<
  | undefined
  | {
      observed: { current: HTMLElement | null };
      shards: Shards;
    }
>(undefined);
