import { CommonModule } from "@angular/common";
import { Component, effect, Input, OnInit, signal, WritableSignal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
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
import { generateQRCodePath } from "@bitwarden/vault";

type FieldMappingControl = {
  label: string;
  name: string;
  value: string;
  options: Array<{ name: string; value: string }>;
};
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

  visualizeForm = new FormGroup({
    qrCodeType: new FormControl<QRCodeOption>(null),
    /* TODO: enumerate possible types for fieldMappings? */
    fieldMappings: new FormGroup({}),
  });

  fieldMappingsControlMeta: {
    [key: string]: Array<FieldMappingControl>;
  } = {
    wifi: [
      {
        label: "Field for SSID",
        name: "ssid",
        value: "",
        options: [{ name: "Test", value: "testvalue" }],
      },
      {
        label: "Field for Password",
        name: "password",
        value: "",
        options: [{ name: "Test", value: "testvalue" }],
      },
    ],
    contact: [
      {
        label: "Field for Contact",
        name: "contact",
        value: "",
        options: [{ name: "Test", value: "testvalue" }],
      },
    ],
    url: [
      {
        label: "Field for URL",
        name: "url",
        value: "",
        options: [{ name: "Test", value: "testvalue" }],
      },
    ],
  };

  dataToShareValues = toSignal(this.visualizeForm.valueChanges);

  qrCodePath: WritableSignal<string> = signal("");

  get qrCodeType() {
    return this.visualizeForm.value.qrCodeType;
  }

  get fieldMappingsGroup(): FormGroup {
    return this.visualizeForm.controls.fieldMappings;
  }

  get fieldMappingsControls(): Array<FieldMappingControl> {
    return this.fieldMappingsControlMeta[this.qrCodeType];
  }

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
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
        /* TODO pass the fieldMappings select values with cipher data, let bkgd fn handle? */
        const qrCodePath = await generateQRCodePath(
          "wifi",
          {
            ssid: values.fieldMappings.ssid,
            password: values.fieldMappings.password,
          },
          this.cipher,
        );
        this.qrCodePath.set(qrCodePath);
      }
    });

    this.visualizeForm.controls.qrCodeType.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      const controlNames = this.fieldMappingsControls.map(({ name }) => name);
      for (const controlName of controlNames) {
        if (controlName === "qrCodeType") {
          continue;
        }
        this.visualizeForm.controls.fieldMappings.removeControl(controlName);
      }

      this.updateControls();
    });
  }

  updateControls() {
    const fields = this.fieldMappingsControls;
    for (const { name, value } of fields) {
      this.visualizeForm.controls.fieldMappings.addControl(name, this.fb.control(value));
    }
  }

  sanitizeSVG(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.qrCodePath());
  }

  async ngOnInit() {
    /* Set default QR Code Type and field fieldMappings after inference (TODO) */
    this.visualizeForm.controls.qrCodeType.setValue("wifi", { emitEvent: false });
    /* Ensure form updated, allow subscribers */
    this.updateControls();
  }
}
