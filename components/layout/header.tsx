"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BellIcon, DownloadIcon, SettingsIcon, UserIcon, MoonIcon, SunIcon, HelpCircleIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HeaderProps {
  title?: string
  subtitle?: string
  showPeriodSelector?: boolean
  showControls?: boolean
  showTabs?: boolean
  tabs?: { value: string; label: string }[]
  selectedTab?: string
  onTabChange?: (value: string) => void
  periodOptions?: { value: string; label: string }[]
  selectedPeriod?: string
  onPeriodChange?: (value: string) => void
}

export function Header({ 
  title, 
  subtitle, 
  showPeriodSelector = false,
  showControls = true,
  showTabs = false,
  tabs = [],
  selectedTab,
  onTabChange,
  periodOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ],
  selectedPeriod = "monthly",
  onPeriodChange = () => {},
}: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [autoTitle, setAutoTitle] = useState("");
  const [autoSubtitle, setAutoSubtitle] = useState("");

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set automatic titles based on path
  useEffect(() => {
    let path = pathname || '';
    
    // Remove leading slash and split by remaining slashes
    const segments = path.replace(/^\//, '').split('/');
    
    if (!segments[0]) {
      setAutoTitle("Dashboard");
      setAutoSubtitle("Utility Management System Overview");
      return;
    }
    
    // Map path segments to titles
    const titleMap: Record<string, { title: string; subtitle: string }> = {
      'water': { 
        title: 'Water Analytics', 
        subtitle: 'Advanced Real-time Analytics Dashboard' 
      },
      'electricity': { 
        title: 'Electricity Management', 
        subtitle: 'Power consumption and distribution tracking' 
      },
      'stp-plant': { 
        title: 'STP Plant', 
        subtitle: 'Sewage treatment performance metrics' 
      },
      'contractors': { 
        title: 'Contractor Tracker', 
        subtitle: 'Contractor agreements and status' 
      },
      'waste-management': { 
        title: 'Waste Management', 
        subtitle: 'Waste collection and recycling analytics' 
      },
      'reports': { 
        title: 'Reports', 
        subtitle: 'Comprehensive system reports and exports' 
      },
      'settings': { 
        title: 'Settings', 
        subtitle: 'System configuration and preferences' 
      },
    };
    
    const segment = segments[0].toLowerCase();
    if (segment in titleMap) {
      setAutoTitle(titleMap[segment].title);
      setAutoSubtitle(titleMap[segment].subtitle);
    } else {
      // Fallback title formatting
      setAutoTitle(segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));
      setAutoSubtitle('');
    }
  }, [pathname]);

  const displayTitle = title || autoTitle;
  const displaySubtitle = subtitle || autoSubtitle;

  return (
    <div className={`bg-[#4E4456] pt-6 pb-4 px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayTitle}</h1>
            {displaySubtitle && (
              <p className="text-purple-100 mt-1 opacity-90">{displaySubtitle}</p>
            )}
          </div>

          {showControls && (
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <div className="flex items-center gap-2">
                {showPeriodSelector && (
                  <div className="bg-white/10 rounded-lg">
                    <Tabs defaultValue={selectedPeriod} value={selectedPeriod} onValueChange={onPeriodChange}>
                      <TabsList className="grid grid-cols-3 min-w-[280px]">
                        {periodOptions.map(option => (
                          <TabsTrigger key={option.value} value={option.value} className="text-white">
                            {option.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                )}
                
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <BellIcon className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <DownloadIcon className="h-5 w-5" />
                </Button>
                
                <span className="hidden md:inline-block h-6 w-px bg-white/20 mx-1"></span>
                
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <HelpCircleIcon className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {showTabs && tabs.length > 0 && (
          <div className="mt-6 border-b border-white/10 -mx-6 px-6">
            <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={onTabChange} className="-mb-px">
              <TabsList className="bg-transparent border-none flex gap-2">
                {tabs.map(tab => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value} 
                    className={`
                      text-white border-b-2 border-transparent data-[state=active]:border-[#8ACCD5] 
                      data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2
                    `}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
