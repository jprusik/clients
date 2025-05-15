import { css } from "@emotion/css";
import { html, TemplateResult } from "lit";

import { Theme } from "@bitwarden/common/platform/enums";

import { border, themes, typography, spacing } from "../constants/styles";

export type ActionButtonProps = {
  buttonText: string | TemplateResult;
  disabled?: boolean;
  isLoading?: boolean;
  theme: Theme;
  handleClick: (e: Event) => void;
};

export function ActionButton({
  buttonText,
  disabled = false,
  isLoading = false,
  theme,
  handleClick,
}: ActionButtonProps) {
  const handleButtonClick = (event: Event) => {
    if (!disabled && !isLoading) {
      handleClick(event);
    }
  };

  return html`
    <button
      class=${actionButtonStyles({ disabled, isLoading, theme })}
      title=${buttonText}
      type="button"
      @click=${handleButtonClick}
    >
      ${buttonText}
    </button>
  `;
}

const actionButtonStyles = ({ disabled, isLoading, theme }: { disabled: boolean; isLoading: boolean; theme: Theme }) => css`
  ${typography.body2}

  user-select: none;
  border: 1px solid transparent;
  border-radius: ${border.radius.full};
  padding: ${spacing["1"]} ${spacing["3"]};
  width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  font-weight: 700;

  ${disabled || isLoading
    ? `
    background-color: ${themes[theme].secondary["300"]};
    color: ${themes[theme].text.muted};
  `
    : `
    background-color: ${themes[theme].primary["600"]};
    cursor: pointer;
    color: ${themes[theme].text.contrast};

    :hover {
      border-color: ${themes[theme].primary["700"]};
      background-color: ${themes[theme].primary["700"]};
      color: ${themes[theme].text.contrast};
    }
  `}

  svg {
    width: fit-content;
    height: 16px;
  }
`;
