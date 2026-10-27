import { ACTIVITY_REVALIDATE_SECONDS, getGithubActivity } from "@/lib/github-activity";

/** Public activity for the home page's live card, cached at the edge so visitors never hit GitHub directly. */
export async function GET(): Promise<Response> {
  const items = await getGithubActivity();
  return Response.json(
    { items },
    { headers: { "Cache-Control": `public, s-maxage=${ACTIVITY_REVALIDATE_SECONDS}, stale-while-revalidate=600` } },
  );
}
