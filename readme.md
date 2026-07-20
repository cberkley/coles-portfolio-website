# Portfolio App - Client UI

This is the client-side UI for Cole's portfolio application, built with React, TypeScript, and Vite.

## Current Architecture

The app is currently structured as a monolith, with business logic living in an Azure Functions layer alongside this client. The plan is to decompose that backend layer into dedicated microservices.

## Planned Microservices

| Service | Responsibility |
|---|---|
| **Work Experience Service** | Manage and serve work history data |
| **Projects Service** | Manage and serve professional project data |
| **Export Service** | Handle resume/portfolio export functionality |
| **Guestbook Service** | Manage visitor messages and guestbook entries |

## Stretch Goals

- **MCP Server** — Expose portfolio data via the Model Context Protocol
- **AI Employer Assistant** — An AI agent that explains to prospective employers why Cole is the right candidate for their open role
