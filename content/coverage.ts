/**
 * Speaking coverage: the fifty states, laid out as a tile grid.
 *
 * THE CLAIM THIS SERVES is the source sentence, verbatim from
 * `_source/extracted/keynote.txt:116`: "Since 1994, he has spoken to over 2,400
 * audiences in all 50 states and 7 foreign countries." The stat ledger on
 * /speaking/ carries "50" as a glyph. This file is what makes that glyph
 * checkable.
 *
 * WHY A TILE GRID AND NOT A MAP. A choropleth at 100% fill is a silhouette: it
 * tells a reader the shape of the United States, which they already know, and
 * nothing else. The claim here is not WHERE, it is ALL OF THEM, and the only
 * way a reader verifies "all of them" is by counting. Fifty equal squares in a
 * rough geographic arrangement can be counted down a column with a finger. A
 * real outline also costs 40 to 60 KB of path data and turns Rhode Island,
 * Delaware and Connecticut into slivers that carry no label at 390px, which is
 * where roughly half the traffic reads this page.
 *
 * THE ARRANGEMENT IS ROUGH ON PURPOSE. Eleven columns by seven rows is the
 * standard US tile-grid shape. Every state sits in the right region and most sit
 * next to their real neighbours, but a 50-cell grid cannot reproduce the real
 * adjacency graph and no tile grid ever has. Do not spend time "fixing" the
 * places where it is a cell out: the arrangement is a mnemonic for scanning, and
 * the postal code in each cell is the actual data.
 *
 * THE SEVEN FOREIGN COUNTRIES ARE NOT NAMED HERE, BECAUSE THEY ARE NOT NAMED
 * ANYWHERE. Grepped across `_source/extracted/`, `_source/pages/`, `content/`
 * and `app/`: the only country names in the whole repository are inside a
 * comment about Egg Farmers of Ontario in content/clients.ts, which is a client
 * and not a booking abroad. Whichever seven they are, the old site never wrote
 * them down. The count itself is also unsettled: docs/OPEN-ITEMS.md item 5
 * records that /boasg/ said eight while every other page said seven, and the
 * site normalized to seven. So the seven render as blank tiles and the cutline
 * says why. See docs/OPEN-ITEMS.md item 22.
 */

export type StateTile = {
  /** The two-letter USPS code, and the only thing printed in the cell. */
  code: string;
  /** The full name, which is what the visually hidden list announces. "WA" is
   *  a glyph a sighted reader decodes from position; a screen reader user gets
   *  no position, so they get the word. */
  name: string;
};

/**
 * Eleven columns, seven rows. `null` is an empty cell and still occupies a grid
 * track, which is why the renderer emits a placeholder for it rather than
 * skipping it: auto-placement with holes would slide every state after the hole
 * one column to the left.
 */
export const stateGrid: readonly (readonly (StateTile | null)[])[] = [
  [
    { code: 'AK', name: 'Alaska' },
    null, null, null, null, null, null, null, null, null,
    { code: 'ME', name: 'Maine' },
  ],
  [
    null, null, null, null, null, null, null, null,
    { code: 'VT', name: 'Vermont' },
    { code: 'NH', name: 'New Hampshire' },
    null,
  ],
  [
    { code: 'WA', name: 'Washington' },
    { code: 'ID', name: 'Idaho' },
    { code: 'MT', name: 'Montana' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'WI', name: 'Wisconsin' },
    null,
    { code: 'MI', name: 'Michigan' },
    { code: 'NY', name: 'New York' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'RI', name: 'Rhode Island' },
  ],
  [
    { code: 'OR', name: 'Oregon' },
    { code: 'NV', name: 'Nevada' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'IA', name: 'Iowa' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'OH', name: 'Ohio' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'CT', name: 'Connecticut' },
  ],
  [
    { code: 'CA', name: 'California' },
    { code: 'UT', name: 'Utah' },
    { code: 'CO', name: 'Colorado' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'MO', name: 'Missouri' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'VA', name: 'Virginia' },
    { code: 'MD', name: 'Maryland' },
    { code: 'DE', name: 'Delaware' },
    null,
  ],
  [
    null,
    { code: 'AZ', name: 'Arizona' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'KS', name: 'Kansas' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'SC', name: 'South Carolina' },
    null, null, null,
  ],
  [
    { code: 'HI', name: 'Hawaii' },
    null,
    { code: 'TX', name: 'Texas' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'AL', name: 'Alabama' },
    { code: 'GA', name: 'Georgia' },
    { code: 'FL', name: 'Florida' },
    null, null,
  ],
];

/** Every tile in the grid, in reading order. */
export const states: readonly StateTile[] = stateGrid
  .flat()
  .filter((tile): tile is StateTile => tile !== null);

/**
 * The states again, alphabetically, for the visually hidden list.
 *
 * Not grid order. A sighted reader scans this graphic by position; a screen
 * reader user is checking a claim against a list, and the way a person checks a
 * list of fifty things is alphabetically.
 */
export const statesAlphabetical: readonly StateTile[] = [...states].sort((a, b) =>
  a.name.localeCompare(b.name, 'en'),
);

/**
 * The number the site states everywhere except the one page that said eight.
 * See docs/OPEN-ITEMS.md item 5. It is a count and nothing more: no country in
 * the set is named in any source we hold.
 */
export const foreignCountryCount = 7;

/* ============================================================================
   BUILD GUARDS

   A wrong number here is not a rendering bug, it is a false claim inside
   Damian's biography, printed fifty times over in a graphic whose entire
   argument is that a reader can count it. So a typo fails the build rather
   than shipping.

   Two guards, because they catch different mistakes. The length check catches a
   dropped or duplicated row. The uniqueness check catches the one a length
   check cannot see: a code typed twice, which keeps the count at fifty while
   silently losing a state.
   ============================================================================ */
if (states.length !== 50) {
  throw new Error(
    `content/coverage.ts: the tile grid holds ${states.length} states, not 50. The site claims all 50, so this is a false claim and not a layout bug.`,
  );
}

{
  const codes = new Set(states.map((tile) => tile.code));
  if (codes.size !== 50) {
    throw new Error(
      `content/coverage.ts: the tile grid holds ${codes.size} distinct postal codes across 50 cells, so at least one state is entered twice and at least one is missing.`,
    );
  }
}
