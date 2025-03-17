import QRCode from "qrcode";

import { CipherType } from "@bitwarden/common/vault/enums";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";

/*
    Wifi View Example
    1. take cipher -> infer(cipher) -> VisualVaultItem::Wifi

    enum VisualVaultItem {
        Wifi {},
        // variant
    }
    
    2. generate (VisualVaultItem enum)

        let qr_code = match (vvi) {
            qr_code_for_wifi(vvi)
        }
*/

type QROptions = "wifi" | "data" | "url";

export function inferQRTypeValuesByCipher(cipher: CipherView): { type: QROptions; fields: object } {
  switch (cipher.type) {
    case CipherType.Login:
    case CipherType.SecureNote:
    case CipherType.Card:
    case CipherType.Identity:
    case CipherType.SshKey:
    default:
      break;
  }

  return { type: "data", fields: {} };
}

export function encodeCipherForQRType(
  type: QROptions,
  mapping: object,
  cipher: CipherView,
): string {
  switch (type) {
    case "wifi":
      break;
    case "url":
      break;
    case "data":
    default:
      break;
  }

  return "";
}

/**
 * Generate a QR code as an SVG Path
 *
 * @param ssid - The wifi ssid
 * @param password - The wifi password
 */
export async function generateQRCodePath(
  type: QROptions,
  mapping: object,
  cipher: CipherView,
): Promise<string> {
  const encodable = encodeCipherForQRType(type, mapping, cipher);

  const svg = await QRCode.toString(encodable, { type: "svg" });

  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");

  const {
    firstChild: { lastChild: path },
  } = doc;

  return path.attributes.d;
}
