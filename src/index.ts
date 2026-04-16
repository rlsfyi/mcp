#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = "https://rls.fyi/publish";

interface Change {
  type: string;
  title: string;
  body?: string;
}

interface PublishRequest {
  project: string;
  version: string;
  summary: string;
  changes: Change[];
  metadata?: {
    repo?: string;
    commit?: string;
  };
}

interface PublishResponse {
  url: string;
  project_url: string;
}

interface ErrorResponse {
  error: string;
}

async function publishRelease(
  apiKey: string,
  request: PublishRequest
): Promise<PublishResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return data as PublishResponse;
}

const server = new Server(
  {
    name: "rlsfyi",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "publish_release",
        description:
          "Publish a release to rls.fyi. Use this when you complete a feature, fix, or significant change. Group related changes into a single release.",
        inputSchema: {
          type: "object" as const,
          properties: {
            project: {
              type: "string",
              description:
                "Project slug (lowercase, alphanumeric, hyphens only). e.g., 'my-app'",
            },
            version: {
              type: "string",
              description:
                "Version string. Semver (1.0.0), date (2025-04-16), or descriptive (beta-launch)",
            },
            summary: {
              type: "string",
              description:
                "One clear sentence describing what changes for the user, not what files you touched",
            },
            changes: {
              type: "array",
              description: "List of individual changes in this release",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    description:
                      "Change type: feature, fix, breaking, improvement, or internal",
                  },
                  title: {
                    type: "string",
                    description: "Concise title for this change",
                  },
                  body: {
                    type: "string",
                    description:
                      "Optional additional context if the change needs explanation",
                  },
                },
                required: ["type", "title"],
              },
            },
            metadata: {
              type: "object",
              description: "Optional metadata",
              properties: {
                repo: {
                  type: "string",
                  description: "Repository URL",
                },
                commit: {
                  type: "string",
                  description: "Commit SHA",
                },
              },
            },
          },
          required: ["project", "version", "summary", "changes"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "publish_release") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const apiKey = process.env.RLSFYI_API_KEY;
  if (!apiKey) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: RLSFYI_API_KEY environment variable is not set. Get your API key from https://rls.fyi/dashboard",
        },
      ],
      isError: true,
    };
  }

  const args = request.params.arguments as unknown as PublishRequest;

  try {
    const result = await publishRelease(apiKey, args);
    return {
      content: [
        {
          type: "text" as const,
          text: `Release published successfully!\n\nRelease URL: ${result.url}\nProject URL: ${result.project_url}`,
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Failed to publish release: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
