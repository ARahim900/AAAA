"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Check if window exists (client side) and set mobile state based on width
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768)
      }
    }

    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Call handler right away so state gets updated with initial window size
    handleResize()
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return isMobile
}

export default useMobile
