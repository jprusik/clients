import { Component } from "@angular/core";

// eslint-disable-next-line no-restricted-imports
import { VisualizeVaultItem } from "../../../../../../../../libs/vault/src/cipher-view/visualize-vault-item/visualize-vault-item.component";

@Component({
  selector: "app-vault-item-visualizer",
  standalone: true,
  imports: [VisualizeVaultItem],
  templateUrl: "./vault-item-visualizer.component.html",
})
export class VaultItemVisualizerComponent {}
