import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Anagrama — Art in Knots'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F7E7DD',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        {/* Logo symbol — simplified knot */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid #0F7A75',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3px solid #0F7A75',
            }}
          />
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#1a1a1a',
            letterSpacing: '-2px',
            marginBottom: 12,
          }}
        >
          ANAGRAMA
        </div>

        <div
          style={{
            fontSize: 22,
            color: '#0F7A75',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
        >
          Art in Knots
        </div>

        <div
          style={{
            fontSize: 18,
            color: '#8A837C',
            letterSpacing: '2px',
          }}
        >
          Handmade in Portugal · One of a kind
        </div>
      </div>
    ),
    { ...size }
  )
}
