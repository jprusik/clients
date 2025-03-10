import { generateWifiQRCode } from "./visual-vault-items";

describe("generateWifiQRCode", () => {
  it("returnsDataUri", () => {
    const qrCode = generateWifiQRCode("foo", "bar");
    expect(qrCode).toBe("?");
  });
});
