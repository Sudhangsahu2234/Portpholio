import { ImageResponse } from 'next/og';

// The portfolio spec (§6) asks for og:image link previews, and §7 listed the
// image as an asset still needed from Sudhang. Generating it here removes that
// dependency — it's built from the site's own tokens at build time.
//
// Deliberately Latin-only: ImageResponse ships a default Latin font, and the
// kanji used elsewhere on the site would render as tofu unless a Japanese
// font file were fetched and embedded, which would make the build depend on a
// network call.

export const alt =
  'Sudhang Sahu — Data Engineer & ML Systems Builder. Pipelines, telemetry, and applied GenAI.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#0b0e14';
const PAPER = '#e8e1d3';
const GOLD = '#d4af37';
const LACQUER = '#a6222b';
const LACQUER_BRIGHT = '#d1343f';
const STEEL = '#8b93a1';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: INK,
          color: PAPER,
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* lacquer-to-gold spine, the same rule that sits under every section title */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            background: `linear-gradient(180deg, ${LACQUER}, ${GOLD})`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 4,
              color: GOLD,
              marginBottom: 28,
            }}
          >
            // OPEN TO DATA ENGINEERING &amp; ML ROLES
          </div>

          <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
            Sudhang Sahu
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 42,
              color: LACQUER_BRIGHT,
              marginTop: 14,
            }}
          >
            Data Engineer &amp; ML Systems Builder
          </div>

          <div style={{ display: 'flex', fontSize: 28, color: PAPER, marginTop: 26 }}>
            Pipelines, telemetry, and applied GenAI — shipped from first principles.
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 44,
              paddingTop: 26,
              borderTop: `1px solid ${STEEL}55`,
              fontSize: 21,
              color: STEEL,
            }}
          >
            Raipur, India · B.S. Data Science, IIT Madras · B.Tech CSE, SSIPMT Raipur
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
