export interface DomQueryService {
  query<T>(
    root: Document | ShadowRoot | Element,
    queryString: string,
    treeWalkerFilter: CallableFunction,
    mutationObserver?: MutationObserver,
    forceDeepQueryAttempt?: boolean,
  ): T[];
  checkPageContainsShadowDom(): void;
  /**
   * Queries the DOM using a selector that supports the `>>>` syntax for
   * piercing shadow DOM boundaries. Each segment separated by `>>>` is
   * queried within the shadow root of the previous result.
   *
   * @param selector - CSS selector string, optionally containing `>>>` for shadow DOM piercing
   * @returns The first matching element, or null if no match is found
   */
  queryDeepSelector(selector: string): Element | null;
}
