import { ServerConfig } from "../platform/abstractions/config/server-config";

/**
 * Feature flags.
 *
 * Flags MUST be short lived and SHALL be removed once enabled.
 *
 * Flags should be grouped by team to have visibility of ownership and cleanup.
 */
// FIXME: update to use a const object instead of a typescript enum
// eslint-disable-next-line @bitwarden/platform/no-enums
export enum FeatureFlag {
  /* Admin Console Team */
  VerifiedSsoDomainEndpoint = "pm-12337-refactor-sso-details-endpoint",
  LimitItemDeletion = "pm-15493-restrict-item-deletion-to-can-manage-permission",
  SsoExternalIdVisibility = "pm-18630-sso-external-id-visibility",
  AccountDeprovisioningBanner = "pm-17120-account-deprovisioning-admin-console-banner",
  SeparateCustomRolePermissions = "pm-19917-separate-custom-role-permissions",

  /* Auth */
  PM9115_TwoFactorExtensionDataPersistence = "pm-9115-two-factor-extension-data-persistence",

  /* Autofill */
  BlockBrowserInjectionsByDomain = "block-browser-injections-by-domain",
  DelayFido2PageScriptInitWithinMv2 = "delay-fido2-page-script-init-within-mv2",
  EnableNewCardCombinedExpiryAutofill = "enable-new-card-combined-expiry-autofill",
  GenerateIdentityFillScriptRefactor = "generate-identity-fill-script-refactor",
  IdpAutoSubmitLogin = "idp-auto-submit-login",
  NotificationRefresh = "notification-refresh",
  UseTreeWalkerApiForPageDetailsCollection = "use-tree-walker-api-for-page-details-collection",
  MacOsNativeCredentialSync = "macos-native-credential-sync",

  /* Billing */
  TrialPaymentOptional = "PM-8163-trial-payment",
  PM12276_BreadcrumbEventLogs = "pm-12276-breadcrumbing-for-business-features",
  PM18794_ProviderPaymentMethod = "pm-18794-provider-payment-method",
  PM17772_AdminInitiatedSponsorships = "pm-17772-admin-initiated-sponsorships",
  PM19956_RequireProviderPaymentMethodDuringSetup = "pm-19956-require-provider-payment-method-during-setup",
  UseOrganizationWarningsService = "use-organization-warnings-service",

  /* Data Insights and Reporting */
  CriticalApps = "pm-14466-risk-insights-critical-application",
  EnableRiskInsightsNotifications = "enable-risk-insights-notifications",

  /* Key Management */
  PrivateKeyRegeneration = "pm-12241-private-key-regeneration",
  UserKeyRotationV2 = "userkey-rotation-v2",
  PM4154_BulkEncryptionService = "PM-4154-bulk-encryption-service",
  UseSDKForDecryption = "use-sdk-for-decryption",
  PM17987_BlockType0 = "pm-17987-block-type-0",

  /* Tools */
  ItemShare = "item-share",
  DesktopSendUIRefresh = "desktop-send-ui-refresh",

  /* Vault */
  PM8851_BrowserOnboardingNudge = "pm-8851-browser-onboarding-nudge",
  PM9111ExtensionPersistAddEditForm = "pm-9111-extension-persist-add-edit-form",
  SecurityTasks = "security-tasks",
  PM19941MigrateCipherDomainToSdk = "pm-19941-migrate-cipher-domain-to-sdk",
  CipherKeyEncryption = "cipher-key-encryption",
  PM18520_UpdateDesktopCipherForm = "pm-18520-desktop-cipher-forms",
  EndUserNotifications = "pm-10609-end-user-notifications",

  /* Platform */
  IpcChannelFramework = "ipc-channel-framework",
}

export type AllowedFeatureFlagTypes = boolean | number | string;

// Helper to ensure the value is treated as a boolean.
const FALSE = false as boolean;

/**
 * Default value for feature flags.
 *
 * DO NOT enable previously disabled flags, REMOVE them instead.
 * We support true as a value as we prefer flags to "enable" not "disable".
 *
 * Flags should be grouped by team to have visibility of ownership and cleanup.
 */
export const DefaultFeatureFlagValue = {
  /* Admin Console Team */
  [FeatureFlag.VerifiedSsoDomainEndpoint]: FALSE,
  [FeatureFlag.LimitItemDeletion]: FALSE,
  [FeatureFlag.SsoExternalIdVisibility]: FALSE,
  [FeatureFlag.AccountDeprovisioningBanner]: FALSE,
  [FeatureFlag.SeparateCustomRolePermissions]: FALSE,

  /* Autofill */
  [FeatureFlag.BlockBrowserInjectionsByDomain]: FALSE,
  [FeatureFlag.DelayFido2PageScriptInitWithinMv2]: FALSE,
  [FeatureFlag.EnableNewCardCombinedExpiryAutofill]: FALSE,
  [FeatureFlag.GenerateIdentityFillScriptRefactor]: FALSE,
  [FeatureFlag.IdpAutoSubmitLogin]: FALSE,
  [FeatureFlag.NotificationRefresh]: true,
  [FeatureFlag.UseTreeWalkerApiForPageDetailsCollection]: FALSE,
  [FeatureFlag.MacOsNativeCredentialSync]: FALSE,

  /* Data Insights and Reporting */
  [FeatureFlag.CriticalApps]: true,
  [FeatureFlag.EnableRiskInsightsNotifications]: true,

  /* Tools */
  [FeatureFlag.ItemShare]: FALSE,
  [FeatureFlag.DesktopSendUIRefresh]: FALSE,

  /* Vault */
  [FeatureFlag.PM8851_BrowserOnboardingNudge]: FALSE,
  [FeatureFlag.PM9111ExtensionPersistAddEditForm]: FALSE,
  [FeatureFlag.SecurityTasks]: true,
  [FeatureFlag.CipherKeyEncryption]: FALSE,
  [FeatureFlag.PM18520_UpdateDesktopCipherForm]: FALSE,
  [FeatureFlag.EndUserNotifications]: FALSE,
  [FeatureFlag.PM19941MigrateCipherDomainToSdk]: FALSE,

  /* Auth */
  [FeatureFlag.PM9115_TwoFactorExtensionDataPersistence]: FALSE,

  /* Billing */
  [FeatureFlag.TrialPaymentOptional]: FALSE,
  [FeatureFlag.PM12276_BreadcrumbEventLogs]: FALSE,
  [FeatureFlag.PM18794_ProviderPaymentMethod]: FALSE,
  [FeatureFlag.PM17772_AdminInitiatedSponsorships]: FALSE,
  [FeatureFlag.PM19956_RequireProviderPaymentMethodDuringSetup]: FALSE,
  [FeatureFlag.UseOrganizationWarningsService]: FALSE,

  /* Key Management */
  [FeatureFlag.PrivateKeyRegeneration]: FALSE,
  [FeatureFlag.UserKeyRotationV2]: FALSE,
  [FeatureFlag.PM4154_BulkEncryptionService]: FALSE,
  [FeatureFlag.UseSDKForDecryption]: FALSE,
  [FeatureFlag.PM17987_BlockType0]: FALSE,

  /* Platform */
  [FeatureFlag.IpcChannelFramework]: FALSE,
} satisfies Record<FeatureFlag, AllowedFeatureFlagTypes>;

export type DefaultFeatureFlagValueType = typeof DefaultFeatureFlagValue;

export type FeatureFlagValueType<Flag extends FeatureFlag> = DefaultFeatureFlagValueType[Flag];

export function getFeatureFlagValue<Flag extends FeatureFlag>(
  serverConfig: ServerConfig | null,
  flag: Flag,
) {
  if (serverConfig?.featureStates == null || serverConfig.featureStates[flag] == null) {
    return DefaultFeatureFlagValue[flag];
  }

  return serverConfig.featureStates[flag] as FeatureFlagValueType<Flag>;
}
