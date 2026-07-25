import {
  XCircle,
  Lock,
  Timer,
  WifiOff,
  Ban,
  FileX2,
  ServerCrash,
  HelpCircle,
} from 'lucide-react';

/**
 * Maps API error codes to user-facing messages and Lucide icon components.
 *
 * @param {object|null} error
 * @param {number|undefined} httpStatus
 * @returns {{ Icon: React.ComponentType, title: string, message: string }}
 */
export function parseApiError(error, httpStatus) {
  const code = error?.code || 'UNKNOWN';

  const map = {
    MISSING_URL: {
      Icon: XCircle,
      title: 'Invalid URL',
      message: 'Please enter a valid public website URL.',
    },
    INVALID_URL: {
      Icon: XCircle,
      title: 'Invalid URL',
      message: 'Please enter a valid public website URL.',
    },
    INVALID_PROTOCOL: {
      Icon: XCircle,
      title: 'Invalid URL',
      message: 'Only http:// and https:// URLs are supported.',
    },
    PRIVATE_ADDRESS: {
      Icon: Lock,
      title: 'Address Not Allowed',
      message: 'Localhost and private IP addresses cannot be analyzed.',
    },
    TIMEOUT: {
      Icon: Timer,
      title: 'Website Took Too Long',
      message: 'The website took too long to respond. Try again later.',
    },
    UNREACHABLE: {
      Icon: Ban,
      title: 'Website Unavailable',
      message: 'This website cannot be reached. Check the URL and try again.',
    },
    NETWORK_ERROR: {
      Icon: WifiOff,
      title: 'Network Error',
      message: "Couldn't connect to the analysis server. Please try again.",
    },
    NOT_HTML: {
      Icon: FileX2,
      title: 'Not an HTML Page',
      message: 'This URL does not point to an HTML page (e.g. PDF or image).',
    },
    SERVER_ERROR: {
      Icon: ServerCrash,
      title: 'Server Error',
      message: 'Something went wrong while analyzing this page.',
    },
  };

  if (map[code]) return map[code];

  // Axios network error (no response from backend at all)
  if (httpStatus === undefined) {
    return {
      Icon: WifiOff,
      title: 'Network Error',
      message: "Couldn't connect to the analysis server. Please try again.",
    };
  }

  return {
    Icon: HelpCircle,
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please retry.',
  };
}
