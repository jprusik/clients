import { Subject } from "rxjs";

import { DomainSettingsService } from "@bitwarden/common/autofill/services/domain-settings.service";
import { AutofillTargetingRulesByDomain } from "@bitwarden/common/autofill/types";
import { FeatureFlag } from "@bitwarden/common/enums/feature-flag.enum";
import { ConfigService } from "@bitwarden/common/platform/abstractions/config/config.service";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";

/**
 * Stub targeting rules for development and testing.
 * These will be replaced by rules fetched from an external Bitwarden-hosted resource.
 */
const STUB_TARGETING_RULES: AutofillTargetingRulesByDomain = {
  "webtests.dev": {
    username: "form > div > input#password",
    password: "form > div > input#username"
  },
  "webtests.dev/forms/login/simple": {
    username: "form > div > input#username",
    password: "form > div > input#password"
  },
  "webtests.dev/forms/login/shadow-root-inputs-closed": {
    username: "#form-container >>> form > div:first-child > div >>> input[name='username']"
  },
  "webtests.dev/forms/identity/address-spec-simple": {
    identityEmail: "#email"
  },
  "webtests.dev/forms/create/create-account-extended-spec": {
    username: "#email",
    identityFullName: "#full-name"
  }
};

/**
 * Browser-specific service responsible for fetching and syncing targeting rules
 * from an external source. For the MVP, loads stub rules when the feature flag is enabled.
 *
 * Architecture follows the PhishingDataService pattern for future external fetch integration.
 */
export class TargetingRulesDataService {
  private _destroy$ = new Subject<void>();

  constructor(
    private domainSettingsService: DomainSettingsService,
    private configService: ConfigService,
    private logService: LogService,
  ) {}

  async init(): Promise<void> {
    // const isEnabled = await this.configService.getFeatureFlag(
    //   FeatureFlag.FillAssistTargetingRules,
    // );

    // if (!isEnabled) {
    //   return;
    // }

    // For MVP, load stub data. When the external rules repo is available,
    // this will be replaced with apiService.nativeFetch() following the
    // PhishingDataService pattern with periodic refresh via TaskSchedulerService.
    await this.domainSettingsService.setTargetingRules(STUB_TARGETING_RULES);
  }

  destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
