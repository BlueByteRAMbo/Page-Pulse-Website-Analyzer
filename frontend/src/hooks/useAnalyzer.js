import { useState, useCallback, useRef } from 'react';
import { analyzeUrl } from '../services/analyzerApi';
import { parseApiError } from '../utils/errorParser';

const STEPS = [
  'Analyzing webpage...',
  'Fetching HTML...',
  'Extracting metadata...',
  'Finalizing report...',
];

const STEP_DURATION = 600; // ms per step

/**
 * Manages all state for a URL analysis request.
 * Returns status, data, error info, and an analyze trigger.
 */
export function useAnalyzer() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [data, setData] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [analyzedUrl, setAnalyzedUrl] = useState('');

  const stepTimerRef = useRef(null);

  const clearStepTimer = () => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  };

  const startStepCycle = () => {
    setStepIndex(0);
    let i = 0;
    stepTimerRef.current = setInterval(() => {
      i += 1;
      if (i < STEPS.length) {
        setStepIndex(i);
      } else {
        clearStepTimer();
      }
    }, STEP_DURATION);
  };

  const analyze = useCallback(async (url) => {
    clearStepTimer();
    setStatus('loading');
    setData(null);
    setErrorInfo(null);
    setAnalyzedUrl(url);
    startStepCycle();

    try {
      const response = await analyzeUrl(url);
      clearStepTimer();

      if (response.success) {
        setData(response.data);
        setStatus('success');
      } else {
        setErrorInfo(parseApiError(response.error));
        setStatus('error');
      }
    } catch (err) {
      clearStepTimer();
      const apiError = err.response?.data?.error ?? null;
      const httpStatus = err.response?.status;
      setErrorInfo(parseApiError(apiError, httpStatus));
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    clearStepTimer();
    setStatus('idle');
    setData(null);
    setErrorInfo(null);
    setStepIndex(0);
    setAnalyzedUrl('');
  }, []);

  return {
    status,
    data,
    errorInfo,
    stepIndex,
    currentStep: STEPS[stepIndex],
    stepProgress: ((stepIndex + 1) / STEPS.length) * 100,
    analyzedUrl,
    analyze,
    reset,
    steps: STEPS,
  };
}
