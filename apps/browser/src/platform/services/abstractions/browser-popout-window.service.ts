interface BrowserPopoutWindowService {
  closeActivePopoutWindows(): Promise<void>;
  openLoginPrompt(senderWindowId: number): Promise<void>;
}

export { BrowserPopoutWindowService };
