# Portfolio source check

Checked on 2026-10-15 against the public GitHub repositories and the [Medium feed](https://medium.com/feed/@easinxarafat).
Repeat those checks whenever refreshing portfolio content; this is a source snapshot, not an automatic synchronization service.

## Native project visuals

The root page and project archive use reusable Open Circuit conceptual visuals from `@/components/agentic-work/visuals`.
`AgenticProjectVisual` receives the project ID and explains the same verified descriptions recorded in `components/agentic-work/content.ts`.
These are native schematics, not screenshots or claims of live system state.
The visual wrapper is hidden from assistive technology; the existing visible project summary provides the real text alternative.

## Images

The projects page no longer uses repository or README screenshots. Each project is explained by a native visual in `components/agentic-work/visuals/`.

## Link and article handling

The public project records live in `components/agentic-work/content.ts` and are reused by the root page and project archive.
Previously linked private repositories have no public source action; their existing product and case-study destinations remain available.
The Multi-Agent Orchestration staging hostname did not resolve during this check, so only its public source and documentation are advertised.

`lib/medium-articles.ts` supplements the existing archive with the missing October 5 relationship essay and July 3 DARK essay.
Their titles, dates, destinations and cover images came from the public feed; summaries are original and reading times are left empty because the feed does not supply them.
The root page, `/articles` and `/blogs` share those refreshed records while native posts keep their existing data path.
