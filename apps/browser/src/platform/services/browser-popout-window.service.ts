import { BrowserApi } from "../browser/browser-api";

import { BrowserPopoutWindowService as BrowserPopupWindowServiceInterface } from "./abstractions/browser-popout-window.service";

class BrowserPopoutWindowService implements BrowserPopupWindowServiceInterface {
  private activePopoutTabIds: Set<number> = new Set();
  private defaultPopoutWindowOptions: chrome.windows.CreateData = {
    type: "normal",
    focused: true,
    width: 500,
    height: 800,
  };

  async closeActivePopoutWindows() {
    if (!this.activePopoutTabIds?.size) {
      return;
    }

    for (const tabId of this.activePopoutTabIds) {
      await BrowserApi.removeTab(tabId);
    }

    this.activePopoutTabIds.clear();
  }

  async openLoginPrompt(senderWindowId: number) {
    await this.closeActivePopoutWindows();
    await this.openPopoutWindow(senderWindowId);
  }

  private async openPopoutWindow(senderWindowId: number, popupWindowURL?: string) {
    const senderWindow = senderWindowId && (await BrowserApi.getWindow(senderWindowId));
    const url = chrome.extension.getURL(popupWindowURL || "popup/index.html?uilocation=popout");

    const offsetRight = 15;
    const offsetTop = 90;
    const popupWidth = this.defaultPopoutWindowOptions.width;
    const windowOptions = senderWindow
      ? {
          ...this.defaultPopoutWindowOptions,
          url,
          left: senderWindow.left + senderWindow.width - popupWidth - offsetRight,
          top: senderWindow.top + offsetTop,
        }
      : { ...this.defaultPopoutWindowOptions, url };

    const popupWindow = await BrowserApi.createWindow(windowOptions);
    this.activePopoutTabIds.add(popupWindow?.tabs[0].id);
  }
}

export default BrowserPopoutWindowService;
