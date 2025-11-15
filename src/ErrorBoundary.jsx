
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something broke in the app</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#b91c1c' }}>
            {String(this.state.error && this.state.error.toString())}
          </pre>
          <p>Please open devtools → Console and paste the error here so I can debug.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
