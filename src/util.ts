import { Shards } from "./interfaces";

export function deferAction(action: () => void) {
  setTimeout(action, 1);
}

export const inlineProp = <T>(name: string, value: T) => {
  const obj: Record<string, T> = {};
  obj[name] = value;
  return obj;
};

export const extractRef = <T extends object>(
  ref: React.MutableRefObject<T> | T
) => (ref && "current" in ref ? ref.current : ref);

function nonNull<T>(items: (T | null)[]) {
  let result: T[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item !== null) {
      result.push(item);
    }
  }
  return result;
}

export function extractShards(shards: Shards) {
  let result: (HTMLElement | null)[] = [];

  for (let i = 0; i < shards.length; i++) {
    const shard = shards[i];
    if (shard && "current" in shard) {
      result.push(shard.current);
    } else {
      result.push(shard);
    }
  }

  return nonNull(result);
}
