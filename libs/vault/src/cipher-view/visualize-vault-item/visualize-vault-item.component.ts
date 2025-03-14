import { Component, Input } from "@angular/core";

import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";

@Component({
  selector: "app-visualize-vault-item",
  standalone: true,
  imports: [],
  templateUrl: "./visualize-vault-item.component.html",
})
export class VisualizeVaultItem {
  @Input() cipher?: CipherView;
}
