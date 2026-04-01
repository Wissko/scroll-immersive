export const dynamic = "force-dynamic";

export default function NotFound() {
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
        <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
        <p style={{ opacity: 0.5 }}>Page not found</p>
      </div>
    </div>
  );
}
