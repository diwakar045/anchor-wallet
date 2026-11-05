// src/track.js
// Anonymous usage analytics for university research prototype using PostHog
// Preserves complete user privacy: simulated money, no PII, no IP, masked inputs.

import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || "";
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

// Helper to safely access localStorage
function getStoredParticipantId() {
  try {
    const key = "anchor_research_participant_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = "p_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  } catch (e) {
    return "p_anon_" + Math.random().toString(36).substring(2, 9);
  }
}

let isInitialized = false;
let hasConsented = false;
const participantId = getStoredParticipantId();
const sessionStartedAt = new Date().toISOString();

// Check if consent was already given in a previous session
try {
  hasConsented = localStorage.getItem("anchor_research_consented") === "true";
} catch (e) {
  hasConsented = false;
}

export function initPostHog() {
  if (isInitialized || !POSTHOG_KEY || POSTHOG_KEY === "phc_your_key_here") {
    return;
  }

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      ip: false, // Never collect IP or IP-based identity
      opt_out_capturing_by_default: true, // Wait until consent
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: undefined, // maskAllText off
      },
      loaded: (ph) => {
        // Register initial super properties
        ph.register({
          participant_id: participantId,
          variant: "anchor",
          viewport_width: typeof window !== "undefined" ? window.innerWidth : 393,
          session_started_at: sessionStartedAt,
        });

        if (hasConsented) {
          ph.opt_in_capturing();
        }
      },
    });

    isInitialized = true;
  } catch (err) {
    console.warn("[PostHog] Init blocked or failed:", err);
  }
}

// Opt-in after user taps Continue on consent screener
export function optInTracking(experienceLevel) {
  hasConsented = true;
  try {
    localStorage.setItem("anchor_research_consented", "true");
    if (experienceLevel) {
      localStorage.setItem("anchor_research_experience", experienceLevel);
    }
  } catch (e) {}

  if (isInitialized) {
    try {
      posthog.opt_in_capturing();
      if (experienceLevel) {
        posthog.register({ experience_level: experienceLevel });
      }
    } catch (err) {}
  }

  // Track the screener answer
  track("screener_answered", { experience_level: experienceLevel });
}

export function getParticipantId() {
  return participantId;
}

export function hasUserConsented() {
  return hasConsented;
}

// Core tracking export
export function track(eventName, props = {}) {
  // Console log in dev for verification
  if (import.meta.env.DEV || true) {
    console.log(`%c[Analytics] ${eventName}`, "color: #0051fe; font-weight: bold;", props);
  }

  if (!isInitialized || !hasConsented) {
    return;
  }

  try {
    posthog.capture(eventName, props);
  } catch (err) {
    // Ad blockers or network errors must never throw
  }
}

// Beacon transport for unload / abandon
export function trackBeacon(eventName, props = {}) {
  if (import.meta.env.DEV || true) {
    console.log(`%c[Analytics Beacon] ${eventName}`, "color: #d62839; font-weight: bold;", props);
  }

  if (!isInitialized || !hasConsented) {
    return;
  }

  try {
    posthog.capture(eventName, props, { transport: "sendBeacon" });
  } catch (err) {}
}

// Register additional super property (e.g. experience_level)
export function registerSuperProperties(props = {}) {
  if (isInitialized) {
    try {
      posthog.register(props);
    } catch (err) {}
  }
}

// Automatically initialize PostHog on module load if key exists
initPostHog();
