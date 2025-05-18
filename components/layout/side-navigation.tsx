"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, Menu, X } from "lucide-react"

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Water Analytics",
    href: "/water",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    title: "Electricity Management",
    href: "/electricity",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "STP Plant",
    href: "/stp-plant",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    title: "Contractor Tracker",
    href: "/contractors",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Waste Management",
    href: "/waste-management",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  },
  {
    title: "Reports",
    href: "/reports",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Settings",
    href: "/settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
]

export function SideNavigation() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile nav when changing pages
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Animation variants
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' }
  }

  // Mobile overlay animation
  const overlayVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' }
  }

  return (
    <>
      {/* Mobile menu overlay */}
      {isMobile && (
        <div className="block lg:hidden">
          <button 
            onClick={() => setMobileOpen(true)}
            className="fixed top-4 left-4 z-20 p-2 rounded-md bg-[#4E4456] text-white shadow-md"
          >
            <Menu size={24} />
          </button>

          {mobileOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setMobileOpen(false)}
            >
              <motion.div 
                className="fixed top-0 left-0 h-screen w-64 bg-[#4E4456] text-white py-4 px-2 z-40"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8 px-4">
                  <div className="text-xl font-bold">Muscat Bay Utilities</div>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="text-white p-1 rounded-full hover:bg-[#8ACCD5]/20"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname?.startsWith(item.href));
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-[#8ACCD5]/20 text-white"
                            : "text-gray-100 hover:bg-[#8ACCD5]/10 hover:text-white"
                        )}
                      >
                        <span className={cn("mr-3", isActive ? "text-[#8ACCD5]" : "")}>
                          {item.icon}
                        </span>
                        {item.title}
                      </Link>
                    )
                  })}
                </nav>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-2 bg-[#3A3441] rounded-md p-2">
                    <div className="h-8 w-8 rounded-full bg-[#8ACCD5] flex items-center justify-center">
                      <span className="font-semibold text-[#4E4456]">MB</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Muscat Bay</div>
                      <div className="text-xs text-gray-300">Utility Admin</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}

      {/* Desktop sidebar */}
      <motion.div 
        className="hidden lg:block fixed top-0 left-0 h-screen bg-[#4E4456] text-white py-4 px-2 z-10"
        variants={sidebarVariants}
        initial="expanded"
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8 px-4">
          {!collapsed && (
            <div className="text-xl font-bold truncate">Muscat Bay Utilities</div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-[#8ACCD5]/20 text-white"
          >
            <ChevronRight
              size={20}
              className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.title : ""}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-[#8ACCD5]/20 text-white"
                    : "text-gray-100 hover:bg-[#8ACCD5]/10 hover:text-white",
                  collapsed ? "justify-center" : ""
                )}
              >
                <span className={cn("", isActive ? "text-[#8ACCD5]" : "", collapsed ? "" : "mr-3")}>
                  {item.icon}
                </span>
                {!collapsed && item.title}
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={cn(
            "flex items-center bg-[#3A3441] rounded-md p-2",
            collapsed ? "justify-center" : "space-x-2"
          )}>
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#8ACCD5] flex items-center justify-center">
              <span className="font-semibold text-[#4E4456]">MB</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-medium">Muscat Bay</div>
                <div className="text-xs text-gray-300">Utility Admin</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
