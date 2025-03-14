import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { ButtonModule, DialogModule, TypographyModule } from "@bitwarden/components";

import { VisualizeVaultItem } from "../visualize-vault-item/visualize-vault-item.component";

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
  constructor() {}
}
