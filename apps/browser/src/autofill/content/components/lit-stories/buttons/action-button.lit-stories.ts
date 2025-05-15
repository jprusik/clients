import { Meta, StoryObj } from "@storybook/web-components";

import { ThemeTypes } from "@bitwarden/common/platform/enums/theme-type.enum";

import { ActionButton, ActionButtonProps } from "../../buttons/action-button";

export default {
  title: "Components/Buttons/Action Button",
  argTypes: {
    buttonText: { control: "text" },
    disabled: { control: "boolean" },
    theme: { control: "select", options: [...Object.values(ThemeTypes)] },
    handleClick: { control: false },
  },
  args: {
    buttonText: "Click Me",
    disabled: false,
    isLoading: false,
    theme: ThemeTypes.Light,
    handleClick: () => alert("Clicked"),
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/LEhqLAcBPY8uDKRfU99n9W/Autofill-notification-redesign?node-id=487-14755&t=2O7uCAkwRZCcjumm-4",
    },
  },
} as Meta<ActionButtonProps>;

const Template = (args: ActionButtonProps) => ActionButton({ ...args });

export const Default: StoryObj<ActionButtonProps> = {
  render: Template,
};
