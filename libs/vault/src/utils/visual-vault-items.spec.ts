import { generateWifiQRCode } from "./visual-vault-items";

describe("generateWifiQRCode", () => {
    it("returnsDataUri", () => {
        let qrCode = generateWifiQRCode("foo", "bar");
        expect(qrCode).toBe("?")
    });
});
