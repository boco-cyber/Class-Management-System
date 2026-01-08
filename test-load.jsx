// Test if external JSX loading works
const { useState } = React;

const TestApp = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>External JSX File Loading Test</h1>
      <p>If you see this, external JSX files are loading correctly!</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Count: {count}
      </button>
      <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
        <p>✓ React is working</p>
        <p>✓ External JSX file loaded</p>
        <p>✓ State is working</p>
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
          The main app should work now. There might be a syntax error in youth-ministry-app.jsx
        </p>
      </div>
    </div>
  );
};
