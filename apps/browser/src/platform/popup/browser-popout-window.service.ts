import { BrowserApi } from "../browser/browser-api";

import { BrowserPopoutWindowService as BrowserPopupWindowServiceInterface } from "./abstractions/browser-popout-window.service";

class BrowserPopoutWindowService implements BrowserPopupWindowServiceInterface {
  private singleActionPopoutTabIds: Record<string, number> = {};
  private defaultPopoutWindowOptions: chrome.windows.CreateData = {
    type: "normal",
    focused: true,
    width: 500,
    height: 800,
  };

  async openUnlockPrompt(senderWindowId: number) {
    await this.closeUnlockPrompt();
    await this.openSingleActionPopout(
      senderWindowId,
      "popup/index.html?uilocation=popout",
      "unlockPrompt"
    );
  }

  async closeUnlockPrompt() {
    await this.closeSingleActionPopout("unlockPrompt");
  }

  async openPasswordRepromptPrompt(
    senderWindowId: number,
    {
      cipherId,
      senderTabId,
      action,
    }: {
      cipherId: string;
      senderTabId: number;
      action: string;
    }
  ) {
    await this.closePasswordRepromptPrompt();

    const promptWindowPath =
      "popup/index.html#/view-cipher" +
      "?uilocation=popout" +
      `&cipherId=${cipherId}` +
      `&senderTabId=${senderTabId}` +
      `&action=${action}`;

    await this.openSingleActionPopout(senderWindowId, promptWindowPath, "passwordReprompt");
  }

  async closePasswordRepromptPrompt() {
    await this.closeSingleActionPopout("passwordReprompt");
  }

  async openFido2Popout(
    senderWindowId: number,
    {
      sessionId,
      senderTabId,
    }: {
      sessionId: string;
      senderTabId: number;
    }
  ): Promise<void> {
    await this.closeFido2Popout();

    const promptWindowPath =
      "popup/index.html#/fido2" +
      "?uilocation=popout" +
      `&sessionId=${sessionId}` +
      `&senderTabId=${senderTabId}`;

    await this.openSingleActionPopout(senderWindowId, promptWindowPath, "fido2Popout", {
      width: 200,
      height: 500,
    });
  }

  async closeFido2Popout(): Promise<void> {
    await this.closeSingleActionPopout("fido2Popout");
  }

  private async openSingleActionPopout(
    senderWindowId: number,
    popupWindowURL: string,
    singleActionPopoutKey: string,
    options: chrome.windows.CreateData = {}
  ) {
    const senderWindow = senderWindowId && (await BrowserApi.getWindow(senderWindowId));
    const url = chrome.extension.getURL(popupWindowURL);
    const offsetRight = 15;
    const offsetTop = 90;
    // Use overrides in `options` if provided, otherwise use default
    const popupWidth = options?.width || this.defaultPopoutWindowOptions.width;
    const windowOptions = senderWindow
      ? {
          ...this.defaultPopoutWindowOptions,
          left: senderWindow.left + senderWindow.width - popupWidth - offsetRight,
          top: senderWindow.top + offsetTop,
          ...options,
          url,
        }
      : { ...this.defaultPopoutWindowOptions, url, ...options };

    const popupWindow = await BrowserApi.createWindow(windowOptions);

    if (!singleActionPopoutKey) {
      return;
    }
    this.singleActionPopoutTabIds[singleActionPopoutKey] = popupWindow?.tabs[0].id;
  }

  private async closeSingleActionPopout(popoutKey: string) {
    const tabId = this.singleActionPopoutTabIds[popoutKey];
    if (!tabId) {
      return;
    }
    await BrowserApi.removeTab(tabId);
    this.singleActionPopoutTabIds[popoutKey] = null;
  }
}

export default BrowserPopoutWindowService;
