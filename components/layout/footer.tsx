export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">© 2025 Muscat Bay Operations. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-[#4E4456] text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-[#4E4456] text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-[#4E4456] text-sm">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-xs">
          <p>Version 2.0.1</p>
        </div>
      </div>
    </footer>
  )
}
