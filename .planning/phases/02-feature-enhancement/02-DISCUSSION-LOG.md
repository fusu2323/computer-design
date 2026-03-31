# Phase 2: 功能增强 - Discussion Log (Assumptions Mode)

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the analysis.

**Date:** 2026-03-31
**Phase:** 02-feature-enhancement
**Mode:** discuss (assumptions mode — codebase-first analysis)
**Areas discussed:** Vision Mentor scope, Orchestrator UI, User Profile, Knowledge Curator scope, Creative Artisan, Vision Mentor scenarios

## Assumptions Presented

### Vision Mentor Scope
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Reduce to 1 scenario (shadow puppet only) | Confident | User explicitly said "移除苏绣和粘土暂时先把皮影这个做好吧" |
| Optimize shadow puppet evaluation algorithm | Confident | User said "优化下判定的算法" |
| localStorage for practice history | Confident | Consistent with Knowledge Curator's session approach |

### Orchestrator UI
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Transform MasterWorkshop.jsx to chat UI | Confident | User chose "Dedicated Master Workshop chat page" |
| Backend orchestrator already exists | Confident | `orchestrator_service.py` with intent detection + task routing + parallel execution |
| Visible orchestrator page, not floating button | Confident | User rejected floating button option |

### User Profile
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Anonymous sessions via localStorage | Confident | Consistent with Knowledge Curator pattern; user chose this over full auth |
| MyPractice.jsx needs real data integration | Confident | Currently all mock data (12.5h, 85%, Lv.2) |

### Knowledge Curator
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Skip data population for now | Confident | User said "暂时不处理这边" |

### Creative Artisan
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Keep as-is | Confident | User chose "Keep as-is" from options |

## Corrections Made

No corrections — all assumptions confirmed by user or derived from explicit user statements.

## Auto-Resolved

None — no --auto flag used.

## External Research

None — assumptions derived from codebase analysis and user discussion.

## Discussion Summary

User confirmed the following explicit priorities:
1. Vision Mentor: Remove embroidery + clay, focus ONLY on shadow puppet, improve algorithm
2. Orchestrator: Dedicated Master Workshop chat page (not background-only, not floating button)
3. User Profile: Anonymous localStorage sessions
4. Knowledge Curator: Skip (deferred)
5. Creative Artisan: Keep as-is

---
