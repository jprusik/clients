import { css } from "@emotion/css";
import { ContextConsumer } from "@lit/context";
import { html } from "lit";

import { Theme, ThemeTypes } from "@bitwarden/common/platform/enums";

import { spacing, themes } from "../constants/styles";

import { CloseButton } from "./buttons/close-button";
import { BrandIcon } from "./brand-icon";
import { NotificationHeaderMessage } from "./header-message";

export function NotificationHeader({
  handleCloseNotification,
  hasBody,
  isVaultLocked,
  message,
  theme = ThemeTypes.Light,
}: {
  handleCloseNotification: (e: Event) => void;
  hasBody: boolean;
  // const theme = new ContextConsumer(this, {context: themeContext, subscribe: true, callback: (ctx) => {console.log('context callback!')}} );
  // console.log('theme:', theme);
  isVaultLocked: boolean;
  message: string;
  theme: Theme;
}) {
  const showIcon = true;
  const isDismissable = true;

  return html`
    <div class=${notificationHeaderStyles({ hasBody, theme })}>
      ${showIcon ? BrandIcon({ isVaultLocked }) : null}
      ${NotificationHeaderMessage({ message, theme })}
      ${isDismissable ? CloseButton({ handleCloseNotification, theme }) : null}
    </div>
  `;
}

const notificationHeaderStyles = ({ hasBody, theme }: { hasBody: boolean; theme: Theme }) => css`
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px 8px 16px;
  white-space: nowrap;

  ${hasBody
    ? css`
        border-bottom: 0.5px solid ${themes[theme].secondary["300"]};
      `
    : css``}
`;
