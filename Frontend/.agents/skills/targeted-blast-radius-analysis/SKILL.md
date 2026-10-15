---
name: targeted-blast-radius-analysis
description: >-
  Specialized skill for conducting deep static analysis, dependency tracing, and scope verification before and after code changes. Ensures modifications are strictly isolated to the designated feature scope, preventing regressions, behavioral side-effects, or unintended breaking changes across adjacent modules.
---

# Agent Skill: Targeted Blast Radius & Regression Analysis

## Description
Specialized agent capability for conducting deep static analysis, dependency tracing, and scope verification before and after code changes. The agent ensures that modifications are strictly isolated to the designated feature scope, preventing regressions, behavioral side-effects, or unintended breaking changes across adjacent modules.

---

## Core Capabilities

1. **Pre-Change Blast Radius Analysis**
   - Perform static reference lookups across the codebase for all symbols, functions, types, routes, and shared state touched by the intended change.
   - Map both direct and transitive dependencies (who imports this component/utility, and who imports those importers).
   - Classify all detected call sites into **In-Scope (Target Feature)** vs. **Out-of-Scope (Adjacent Features)**.

2. **Strict Scope Confinement**
   - If a shared utility or common component must be altered, enforce an abstraction fork (e.g., feature-specific wrapper, adapter pattern, or local overload) rather than editing the shared primitive directly.
   - Prevent modifications to global state shapes, shared database schemas, API contracts, or global CSS variables that downstream features rely upon.

3. **Post-Change Regression & Integrity Verification**
   - Inspect git diffs line-by-line to ensure changes do not exceed the explicit feature boundary.
   - Verify that all public API surfaces and shared contracts remain 100% backward-compatible.
   - Validate that tests outside the feature scope continue to pass without modifications to their assertion logic.

---

## Analysis Workflow

1. **Target Identification & Scope Definition:**
   - Clearly delineate target feature files, functions, and endpoints intended for changes.
   - Formally document in-scope modules versus out-of-scope adjacent modules before editing.

2. **Static Dependency Tracing:**
   - Scan codebase for every symbol, type, function, and component to be modified using text and symbol searches.
   - Build a dependency graph of direct consumers and downstream transitive callers.
   - Categorize all identified call sites; if any caller falls outside target feature boundaries, flag as high blast-radius risk.

3. **Scope Confinement & Abstraction Forking:**
   - For shared primitives requiring new behavior, implement an abstraction fork (e.g., custom wrapper, adapter, or feature-scoped sub-component) rather than modifying the shared core.
   - Keep existing function signatures, return shapes, and exported types unchanged.

4. **Diff Inspection & Boundary Auditing:**
   - Review git diff line-by-line after code changes to ensure changes are restricted exclusively to target scopes.
   - Confirm no incidental edits occurred in shared utilities, build configs, database schemas, or adjacent features.

5. **Regression Verification:**
   - Run tests targeting adjacent, unaffected modules to verify zero functional degradation.
   - Verify that public API contracts and shared interfaces remain 100% backward compatible.

---

## Safety Boundaries & Execution Constraints

> **CRITICAL EXECUTION RULES**

- **Zero Unintended Cross-Module Edits:**
  - The agent MUST NOT modify files belonging to adjacent, unrelated features to accommodate changes in the target feature.

- **Preserve Shared Primitives:**
  - Never alter existing behavior, parameters, or return types of shared components or utilities. Always fork or extend locally.

- **Strict Diff Validation:**
  - Every modification must be validated against the defined blast radius before finalizing the task.
