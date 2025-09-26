/**
 * Common component utilities for loading states, error handling, and animations
 */

import React from "react";
import { Loader } from "@progress/kendo-react-indicators";
import { Notification } from "@progress/kendo-react-notification";
import { Card, CardBody } from "@progress/kendo-react-layout";
import { cardStyles } from "./styles";

export interface LoadingProps {
  message?: string;
  minHeight?: string;
}

export interface ErrorProps {
  message: string;
  onClose?: () => void;
  type?: "error" | "warning" | "info";
}

export interface FadeState {
  fadeClass: string;
  setFadeClass: (className: string) => void;
}

/**
 * Standardized loading component
 */
export function LoadingCard({
  message = "Loading...",
  minHeight = "250px",
}: LoadingProps) {
  return (
    <Card style={{ ...cardStyles.base, minHeight }}>
      <CardBody style={cardStyles.loading}>
        <Loader type="infinite-spinner" />
        <span style={{ marginLeft: "1rem" }}>{message}</span>
      </CardBody>
    </Card>
  );
}

/**
 * Standardized error card component
 */
export function ErrorCard({ message }: { message: string }) {
  return (
    <Card style={cardStyles.base}>
      <CardBody style={cardStyles.error}>
        <p>{message}</p>
      </CardBody>
    </Card>
  );
}

/**
 * Standardized error notification component
 */
export function ErrorNotification({
  message,
  onClose,
  type = "error",
}: ErrorProps) {
  if (!message) return null;

  return (
    <Notification type={{ style: type, icon: true }} closable onClose={onClose}>
      {message}
    </Notification>
  );
}

/**
 * Custom hook for managing fade animations
 */
export function useFadeAnimation(initialClass = "") {
  const [fadeClass, setFadeClass] = React.useState(initialClass);

  const fadeOut = React.useCallback(() => setFadeClass("fade-out"), []);
  const fadeIn = React.useCallback(() => setFadeClass("fade-in"), []);
  const clearFade = React.useCallback(() => setFadeClass(""), []);

  return { fadeClass, fadeOut, fadeIn, clearFade, setFadeClass };
}

/**
 * Custom hook for managing loading states with fade effects
 */
export function useLoadingWithFade() {
  const [loading, setLoading] = React.useState(false);
  const { fadeClass, fadeOut, fadeIn, setFadeClass } = useFadeAnimation();

  const startLoading = React.useCallback(() => {
    setLoading(true);
    fadeOut();
  }, [fadeOut]);

  const finishLoading = React.useCallback(
    (delay = 300) => {
      setTimeout(() => {
        setLoading(false);
        fadeIn();
      }, delay);
    },
    [fadeIn],
  );

  return { loading, fadeClass, startLoading, finishLoading, setFadeClass };
}

/**
 * Format time from Unix timestamp
 */
export function formatUnixTime(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(timestamp * 1000);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleTimeString([], { ...defaultOptions, ...options });
}

/**
 * Format current date
 */
export function formatCurrentDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Create cancel token for API requests
 */
export function createCancelToken() {
  return { cancelled: false };
}

/**
 * Check if cancel token is cancelled
 */
export function isCancelled(token: { cancelled: boolean }): boolean {
  return token.cancelled;
}

/**
 * Cancel a token
 */
export function cancelToken(token: { cancelled: boolean }): void {
  token.cancelled = true;
}
