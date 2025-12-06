import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 mb-6">
              The application encountered an unexpected error. This has been logged for debugging.
            </p>
            
            {this.state.error && (
              <div className="bg-slate-900 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                <p className="text-red-400 font-mono text-sm">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-slate-500 font-mono text-xs mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack?.slice(0, 500)}
                  </pre>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
