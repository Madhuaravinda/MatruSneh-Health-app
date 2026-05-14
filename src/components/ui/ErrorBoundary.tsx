import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/src/components/ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-4 h-[60vh]">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong.</h2>
          <p className="text-muted-foreground">We apologize for the inconvenience. Please try refreshing the app.</p>
          <Button onClick={() => window.location.reload()}>Refresh App</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
