---
name: frontend-design-integration
description: >-
  Specialized skill for interpreting, generating, and incorporating frontend UI designs into a client-side codebase. Handles design-to-code conversion, external link/snippet ingestion (Figma, CodePen, Tailwind Play), style isolation, and additive-only component creation under src/components/new-ui/ without modifying existing legacy code or server files.
---

# Agent Skill: Frontend Design & UI Integration

## Description
Specialized agent capability for interpreting, generating, and incorporating frontend UI designs into a client-side codebase. The agent handles design-to-code conversion, style alignment, and asset linking while strictly maintaining an additive-only footprint to isolate existing codebase logic and prevent server-side modifications.

---

## Core Capabilities

1. **Design Extraction & Component Authoring**
   - Translate visual design references, design tokens, specifications, or wireframes into modern, reusable frontend components (e.g., React, native Web Components).
   - Ensure responsive layouts (flexbox/grid), semantic HTML, accessibility (ARIA standards), and standard design system tokens (spacing, typography, color palettes).

2. **External Link & Source Ingestion**
   - Accept external URLs (e.g., Figma links, CodePen, Tailwind Play, live demos) or raw code snippets containing pre-made UI designs.
   - Parse and adapt external code to conform to the project’s frontend conventions, styling libraries, and package ecosystem.

3. **Isolated Integration**
   - Integrate newly adapted components into dedicated, modular UI directories (e.g., `src/components/new-ui/<ComponentName>/`).
   - Expose clean props, slots, or interfaces so the component can be imported where needed without side effects on neighboring modules.

---

## Ingestion Workflow (Link & Code Integration)

When an external URL or code snippet is provided to the agent:

1. **Parse & Normalize:**
   - Scan the input for external dependencies, non-standard CSS, or framework mismatches.
   - Extract raw HTML/CSS/JS and convert to the project's specific frontend target framework (React 19 + Vanilla/Modular CSS).

2. **Style Scope Enforcement:**
   - Ensure classes, CSS variables, or styled rules do not pollute global stylesheets.
   - Wrap or namespace styles (e.g., CSS modules or scoped class prefixes) to avoid breaking existing UI elements elsewhere in the application.

3. **Asset & Link Handling:**
   - Detect external CDN assets (fonts, icons, image URLs) and migrate them either to local static asset folders or wrap them cleanly within the newly created component scope.

4. **Integration Verification:**
   - Check that the component exports standard interfaces and compiles cleanly under the active linter and configurations.

---

## Safety Boundaries & Execution Constraints

> **CRITICAL EXECUTION RULES**

- **Zero Server-Side Modifications:**
  - The agent MUST NOT read, edit, or create files within backend, API, database, serverless, or server routing directories (e.g., `/server`, `/api`, `*.controller.*`, `*.service.*`, backend middleware).
  
- **Additive-Only Codebase Modifications:**
  - The agent MUST NOT modify, refactor, or delete already existing frontend files, legacy components, or shared global utilities.
  - All new implementations MUST reside in isolated, dedicated files (e.g., `src/components/new-ui/<ComponentName>/`).
  - If a design supersedes an existing UI element, create a distinct component variant (e.g., `<ComponentName>V2` or distinct path) instead of editing the preexisting implementation.

- **No Overwriting Config or Build Pipelines:**
  - Do not edit build configurations, package manifests (`package.json`), or environment files without explicit developer authorization. Rely strictly on existing dependencies.
