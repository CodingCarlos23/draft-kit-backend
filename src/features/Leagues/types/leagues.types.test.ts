import { describe, expect, it } from 'vitest';
import { LeagueSchema } from './leagues.types';

describe('LeagueSchema', () => {
  it('accepts the full API stat category set', () => {
    const parsed = LeagueSchema.parse({
      externalId: 'api-sync-test',
      name: 'API Sync Test',
      format: 'roto',
      draftType: 'auction',
      leagueType: 'MLB',
      battingCategories: ['R', 'HR', 'RBI', 'SB', 'AVG', 'OBP'],
      pitchingCategories: ['W', 'SV', 'K', 'ERA', 'WHIP', 'QS'],
      rosterSlots: {
        C: 1,
        '1B': 1,
        '2B': 1,
        '3B': 1,
        SS: 1,
        CI: 1,
        MI: 1,
        OF: 3,
        SP: 2,
        RP: 2,
        UTIL: 1,
        P: 0,
        BENCH: 4,
      },
    });

    expect(parsed.battingCategories).toContain('R');
    expect(parsed.pitchingCategories).toContain('WHIP');
    expect(parsed.pitchingCategories).toContain('QS');
  });
});
