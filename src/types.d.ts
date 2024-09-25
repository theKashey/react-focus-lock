export type FocusCallbacks = {
  onFocus?: () => void;
  onBlur?: () => void;
};

export type FocusControl = {
  /**
   * moves focus to the current scope, can be considered as autofocus
   */
  autoFocus(): Promise<void>;
  /**
   * focuses the next element in the scope.
   * If active element is not in the scope, autofocus will be triggered first
   */
  focusNext(options?: FocusOptions): Promise<void>;
  /**
   * focuses the prev element in the scope.
   * If active element is not in the scope, autofocus will be triggered first
   */
  focusPrev(options?: FocusOptions): Promise<void>;
  /**
   * focused the first element in the scope
   */
  focusFirst(options?: { onlyTabbable?: boolean }): Promise<void>;
  /**
   * focused the last element in the scope
   */
  focusLast(options?: { onlyTabbable?: boolean }): Promise<void>;
};
