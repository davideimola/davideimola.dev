# davideimola.dev

The personal site: a portfolio, a blog, and the Factory that turns editorial artifacts into published pages. This glossary holds the terms that are specific to this site and would otherwise be guessed at. It is a glossary only: no implementation detail, no decisions (those live in `docs/adr/`).

## CV

**CV Record**:
The structured data describing Davide's professional history. The single source of truth: every view of the CV, on the site or on paper, derives from it.
_Avoid_: CV data, resume, curriculum

**Rendering**:
A view derived from the CV Record. The PDF is one Rendering, the `/cv` page is another. A Rendering never holds facts of its own.
_Avoid_: version, export, output, format

**Register**:
The voice a Rendering is written in. The same fact is stated narratively on `/about` (prose, first person) and schematically on `/cv` (dense, scannable). Both registers can live in the CV Record as separate fields, because they say the same thing in different ways.
_Avoid_: tone, style, variant

**Employment**:
A full-time job, held as Davide's primary occupation for its whole period.
_Avoid_: job, position, role

**Freelance**:
A paid engagement taken on alongside an Employment, scoped to a project rather than a position. Overlapping dates with an Employment are expected and are not a conflict.
_Avoid_: consulting, contract work, side gig, moonlighting

**Volunteering**:
Unpaid work for a community or non-profit. Sits outside the paid history and is never counted as Employment, however substantial it is. The Community section of `/about` is the narrative Register of the same entries.
_Avoid_: community work, activism
