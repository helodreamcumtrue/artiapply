import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

/**
 * ArticlO Bespoke Brand Logo Mark
 * Precision aerodynamic chevron meeting an orbital deliverability loop.
 */
export const ArticloLogo: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 2.75L3.75 19.5L12 15.75L20.25 19.5L12 2.75Z"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="11.25"
      r="2"
      fill="#d4f933"
      stroke="currentColor"
      strokeWidth={1.25}
    />
    <path
      d="M7.5 17.5L12 15.5L16.5 17.5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Precision Outbound Dispatch / Arrow Diagonal
 */
export const IconArrowUpRight: React.FC<IconProps> = ({ size = 18, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M7 17L17 7M17 7H8M17 7V16" />
  </svg>
);

/**
 * Deliverability & Primary Inbox Shield
 */
export const IconShieldVerified: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2.5L4.5 5.75V11.5C4.5 16.5 7.7 21.1 12 22.25C16.3 21.1 19.5 16.5 19.5 11.5V5.75L12 2.5Z" />
    <path d="M9.25 11.75L11.25 13.75L15.25 9.75" />
  </svg>
);

/**
 * Precision Cadence & Rate Limiter (2.0/s human timer)
 */
export const IconCadenceTimer: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="8.75" />
    <path d="M12 7.25V12L15.5 13.75" />
    <path d="M12 2.25V4.25" />
    <path d="M4.25 12H2.25" />
    <path d="M21.75 12H19.75" />
  </svg>
);

/**
 * Native Gmail & Direct Outreach Envelope
 */
export const IconDirectMail: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="4.5" width="18" height="15" rx="3" />
    <path d="M3.75 6.25L12 12.75L20.25 6.25" />
    <path d="M3.75 18L9 13" />
    <path d="M20.25 18L15 13" />
  </svg>
);

/**
 * Machine Intelligence & Gemini AI Engine
 * Architectural diamond starburst (distinctive, non-generic)
 */
export const IconAiEngine: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    <circle cx="12" cy="12" r="1.5" fill="#d4f933" />
  </svg>
);

/**
 * Dynamic Personalization & Merge Tags {{variable}}
 */
export const IconPersonalize: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4.5 7C3.5 8 3.5 9.5 3.5 10.5C3.5 11.5 2.5 12 2.5 12C2.5 12 3.5 12.5 3.5 13.5C3.5 14.5 3.5 16 4.5 17" />
    <path d="M19.5 7C20.5 8 20.5 9.5 20.5 10.5C20.5 11.5 21.5 12 21.5 12C21.5 12 20.5 12.5 20.5 13.5C20.5 14.5 20.5 16 19.5 17" />
    <circle cx="12" cy="9.5" r="2.75" />
    <path d="M8 17.5C8 15.25 9.75 14 12 14C14.25 14 16 15.25 16 17.5" />
  </svg>
);

/**
 * 8MB Safe Document Attachment
 */
export const IconSafeAttachment: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M13.25 3.25H6.75C5.65 3.25 4.75 4.15 4.75 5.25V18.75C4.75 19.85 5.65 20.75 6.75 20.75H17.25C18.35 20.75 19.25 19.85 19.25 18.75V9.25L13.25 3.25Z" />
    <path d="M13 3.5V9.5H19" />
    <path d="M9 13.5H15" />
    <path d="M9 16.5H13" />
  </svg>
);

/**
 * Checkmark in Hexagon / Verified Token
 */
export const IconVerifiedBadge: React.FC<IconProps> = ({ size = 18, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.25L10.75 14.5L15.5 9.75" />
  </svg>
);

/**
 * High-Velocity Analytics & Pacing Trend
 */
export const IconAnalyticsPulse: React.FC<IconProps> = ({ size = 20, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3.5 19.5H20.5" />
    <path d="M4.5 15.5L8.5 9.5L12.5 13.5L18.5 5.5L19.5 6.5" />
    <circle cx="18.5" cy="5.5" r="1.25" fill="#d4f933" />
  </svg>
);

/**
 * Human Adaptive Strategy (Adaptive bulb/chip)
 */
export const IconAdaptiveGear: React.FC<IconProps> = ({ size = 18, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9 18H15" />
    <path d="M10 21H14" />
    <path d="M12 3C7.5 3 5 6.5 5 10C5 12.5 6.5 14.5 8 16H16C17.5 14.5 19 12.5 19 10C19 6.5 16.5 3 12 3Z" />
    <path d="M12 7V11" />
  </svg>
);

/**
 * Lock / Security Gate
 */
export const IconSecurityLock: React.FC<IconProps> = ({ size = 18, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="4.5" y="10" width="15" height="11" rx="2.5" />
    <path d="M8 10V6.5C8 4.29 9.79 2.5 12 2.5C14.21 2.5 16 4.29 16 6.5V10" />
    <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Settings & System Controls
 */
export const IconSettingsSliders: React.FC<IconProps> = ({ size = 18, className = '', strokeWidth = 1.75, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 7H14M18 7H20" />
    <circle cx="16" cy="7" r="2" />
    <path d="M4 17H6M10 17H20" />
    <circle cx="8" cy="17" r="2" />
  </svg>
);
