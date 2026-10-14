import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "../components/ui/CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  title: "UI/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Go: Story = {
  render: () => (
    <CodeBlock>
      <code className="language-go">{`package main

import "fmt"

func main() {
\tfmt.Println("Hello, world!")
}`}</code>
    </CodeBlock>
  ),
};

export const TypeScript: Story = {
  render: () => (
    <CodeBlock>
      <code className="language-typescript">{`interface User {
  id: string;
  name: string;
  role: "admin" | "user";
}

function greet(user: User): string {
  return \`Hello, \${user.name}\`;
}`}</code>
    </CodeBlock>
  ),
};

export const Bash: Story = {
  render: () => (
    <CodeBlock>
      <code className="language-bash">{`# Install dependencies
pnpm install

# Start dev server
pnpm dev`}</code>
    </CodeBlock>
  ),
};

export const NoLanguage: Story = {
  render: () => (
    <CodeBlock>
      <code>{`plain text block with no language specified`}</code>
    </CodeBlock>
  ),
};

export const Console: Story = {
  render: () => (
    <CodeBlock>
      <code
        className="language-console"
        data-title="~/blog-examples/agent-sessions/adk"
      >{`$ go run .
== default DSN (file:adk-default.db)
Delete returned no error. Rows left for session 7f3c: sessions=0 events=1

$ sqlite3 adk-default.db 'select count(*) from events;'
1`}</code>
    </CodeBlock>
  ),
};
