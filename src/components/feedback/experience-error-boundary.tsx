"use client";

import { Component, type ReactNode } from "react";

import { ErrorFallback } from "@/components/feedback/error-fallback";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ExperienceErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    logger.error("render-boundary", error instanceof Error ? error.name : "unknown");
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          onRetry={() => {
            this.setState({ hasError: false });
          }}
        />
      );
    }
    return this.props.children;
  }
}
