import { NextResponse } from 'next/server';
import { connectDb } from '@/shared/server/connect-db';
import { getAuthenticatedUserId } from '@/shared/server/get-user-id';
import { HttpError } from '@/shared/server/http-errors';
import { leagueDraftsService } from '@/features/Leagues/server/leagueDrafts.service';

type RouteContext = {
  params: Promise<{ leagueId: string; draftId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    await connectDb();
    const userId = getAuthenticatedUserId(_request);
    const { leagueId, draftId } = await context.params;

    const league = await leagueDraftsService.copyDraftToLeague(
      leagueId,
      draftId,
      userId,
    );

    if (!league) {
      return NextResponse.json(
        { success: false, message: 'Draft not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: league });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to copy draft';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
