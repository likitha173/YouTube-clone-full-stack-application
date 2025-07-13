import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '2rem auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>
                        Something went wrong
                    </h2>
                    <p style={{ marginBottom: '1rem', color: '#666' }}>
                        We're sorry, but something unexpected happened. Please try refreshing the page.
                    </p>

                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '1rem'
                            }}
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go Home
                        </button>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <details style={{
                            textAlign: 'left',
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: '#ffebee',
                            border: '1px solid #ffcdd2',
                            borderRadius: '4px'
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#d32f2f' }}>
                                Error Details (Development Only)
                            </summary>
                            <pre style={{
                                marginTop: '1rem',
                                fontSize: '0.875rem',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
