import { Meta, StoryObj } from "@storybook/react";
import { SvgrTest } from "./SvgrTest";

const meta: Meta<typeof SvgrTest> = {
  component: SvgrTest,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
