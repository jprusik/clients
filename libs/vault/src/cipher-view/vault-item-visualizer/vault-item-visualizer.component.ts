import { CommonModule } from "@angular/common";
import { Component, effect, Input, OnInit, signal, WritableSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { QRCodeOption } from "@bitwarden/common/platform/enums";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";
import {
  TypographyModule,
  ButtonModule,
  ItemModule,
  SectionComponent,
  SectionHeaderComponent,
  CardComponent,
  FormFieldModule,
  SelectModule,
} from "@bitwarden/components";
import { generateWiFiQRCode } from "@bitwarden/vault";

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TypographyModule,
    ButtonModule,
    ItemModule,
    SectionComponent,
    SectionHeaderComponent,
    CardComponent,
    FormsModule,
    FormFieldModule,
    SelectModule,
  ],
  selector: "vault-item-visualizer",
  standalone: true,
  templateUrl: "./vault-item-visualizer.component.html",
})
export class VaultItemVisualizerComponent implements OnInit {
  // TODO strings + translations
  // headerText: string;

  @Input() cipher?: CipherView;

  qrCodeOptions: { name: string; value: QRCodeOption }[];

  dataToShareForm = new FormGroup({
    qrCodeType: new FormControl<QRCodeOption>(null),
    fieldWithSSID: new FormControl(""),
    fieldWithPassword: new FormControl(""),
  });

  dataToShareValues = toSignal(this.dataToShareForm.valueChanges);

  private wiFiQRCode: WritableSignal<string> = signal("");

  constructor(private sanitizer: DomSanitizer) {
    /* Set initial QR Code options */
    this.qrCodeOptions = [
      { name: "Wi-Fi", value: "wifi" },
      { name: "Contact", value: "contact" },
      { name: "URL", value: "url" },
      // { name: i18nService.t("example"), value: example },
    ];
    effect(async () => {
      /* Retriggers whenever form changes */
      const values = this.dataToShareValues();
      if (typeof values !== "undefined" && values.qrCodeType !== null) {
        const wiFiQRCode = await generateWiFiQRCode(values.fieldWithPassword, values.fieldWithSSID);
        this.wiFiQRCode.set(wiFiQRCode);
      }
    });
  }

  sanitizeSVG(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.wiFiQRCode());
  }

  async ngOnInit() {
    console.log('cipher:', this.cipher);
    /* Set default QR Code Type and field options after inference (TODO) */
    this.dataToShareForm.setValue({
      qrCodeType: "wifi",
      fieldWithSSID: "Username",
      fieldWithPassword: "Password",
    });
  }
}
