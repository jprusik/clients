import { DIALOG_DATA } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";
import { ButtonModule, DialogModule, TypographyModule } from "@bitwarden/components";

import { VisualizeVaultItem } from "../visualize-vault-item/visualize-vault-item.component";

type VisualizeVaultItemDialogParams = {
  cipher: CipherView;
};

@Component({
  selector: "app-visualize-vault-item-dialog",
  standalone: true,
  imports: [
    CommonModule,
    JslibModule,
    DialogModule,
    ButtonModule,
    TypographyModule,
    VisualizeVaultItem,
  ],
  templateUrl: "./visualize-vault-item-dialog.component.html",
})
export class VisualizeVaultItemDialog {
  constructor(@Inject(DIALOG_DATA) protected data: VisualizeVaultItemDialogParams) {}
}
