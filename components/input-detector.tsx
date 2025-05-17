'use client';

import { useEffect } from 'react';

/**
 * This component detects input type (mouse/touch) and ensures consistent rendering
 * between server and client to prevent hydration mismatches.
 */
export function InputDetector() {
  useEffect(() => {
    const handleInputTypeChange = (type: 'mouse' | 'touch') => {
      document.body.dataset.inputType = type;
    };

    const handleMouseMove = () => {
      handleInputTypeChange('mouse');
      // Remove touch event listeners once mouse is detected
      document.removeEventListener('touchstart', handleTouchStart);
    };

    const handleTouchStart = () => {
      handleInputTypeChange('touch');
      // Remove mouse event listeners once touch is detected
      document.removeEventListener('mousemove', handleMouseMove);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);

    // Set initial input type to null to avoid hydration mismatch
    // The attribute will be added client-side only
    if (document.body.hasAttribute('data-input-type')) {
      document.body.removeAttribute('data-input-type');
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return null;
}