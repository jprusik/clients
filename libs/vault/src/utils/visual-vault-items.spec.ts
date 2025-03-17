import { generateQRCodePath } from "./visual-vault-items";

describe("generateWiFiQRCode", () => {
  it("returnsDataUri", () => {
    const qrCode = generateQRCodePath("foo", "bar");
    expect(qrCode).toBe("?");
  });
});
