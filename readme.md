# Portfolio App - Client UI

This is the client-side UI for Cole's portfolio application, built with React, TypeScript, and Vite.

## Architecture

The React client communicates exclusively with an **Azure Functions** layer, which acts as a Backend for Frontend (BFF). Azure Functions handles authentication, aggregation, and proxying to the underlying microservices — keeping secrets and internal service URLs out of the browser.

### Current State
The app is currently a monolith with all business logic living directly in the Azure Functions layer. The plan is to decompose that logic into dedicated microservices that Azure Functions will orchestrate.

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
