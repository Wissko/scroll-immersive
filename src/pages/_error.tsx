/**
 * Custom error page for pages router compatibility.
 * Next.js 14 requires this to avoid the <Html> import conflict.
 */
import React from 'react'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: '#fff',
      background: '#000',
      fontFamily: 'sans-serif'
    }}>
      <div>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>{statusCode || '?'}</h1>
        <p style={{ opacity: 0.5 }}>
          {statusCode === 404 ? 'Page not found' : 'An error occurred'}
        </p>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }, err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
