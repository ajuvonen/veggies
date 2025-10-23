import {mount} from '@vue/test-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withSetup = <T, Args extends any[]>(
  composable: (...args: Args) => T,
  ...args: Args
): T => {
  let result: T;
  mount({
    setup() {
      result = composable(...args);
      return () => {};
    },
  });
  return result!;
};
