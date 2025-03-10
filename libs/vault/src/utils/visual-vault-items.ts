let QRious = require("qrious");

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

/**
 * Create a wifi QR code.
 * 
 * @param ssid - The wifi ssid
 * @param password - The wifi password
 */
export function generateWifiQRCode(ssid: string, password: string): string {
    let dataURL = `WIFI:S:${ssid};T:<WPA|WEP|>;P:${password};;`;

    var qr = new QRious({
        value: dataURL,
    });

    return qr.toDataURL('image/jpeg');
}
