# Muscat Bay Utility Management System

A comprehensive dashboard for managing and monitoring all utility systems at Muscat Bay property development.

## Modules

- **Water Analytics**: Monitor water supply, distribution, and consumption with loss tracking
- **Electricity Management**: Track power consumption and distribution across different zones
- **STP Plant**: Monitor sewage treatment plant performance metrics
- **Contractor Tracker**: Manage service provider agreements and contract statuses

## Features

- Real-time monitoring of all utility systems
- Interactive charts and data visualizations
- Comprehensive dashboards for each module
- System alerts and notifications
- Historical data analysis
- Performance metrics tracking

## Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Components**: Radix UI, Recharts
- **State Management**: React Context API
- **API**: Next.js API Routes
- **Database**: Supabase

## Backend Data Integration

The dashboard now connects to a Supabase backend to provide real-time monitoring:

- **STP Plant**: Connected to `stp_daily_records` table (323 records) with sewage treatment plant operations data
- **Electricity System**: Connected to four related tables:
  - `electricity_consumption` (56 records) - Main consumption data from Nov 2024 to Apr 2025
  - `electricity_zone_summary` (5 records) - Consumption breakdown by zone
  - `electricity_monthly_trends` (6 records) - Monthly usage trends
  - `electricity_highest_consumption` (5 records) - Units with highest consumption

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/ARahim900/AAAA.git
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the Supabase URL and anon key values

4. Run the development server:
   ```
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Supabase Configuration

To connect the dashboard to your own Supabase instance:

1. Sign up for Supabase at [https://supabase.com/](https://supabase.com/) 
2. Create a new project
3. Create the following tables in your Supabase database:
   - `stp_daily_records`
   - `electricity_consumption`
   - `electricity_zone_summary`
   - `electricity_monthly_trends`
   - `electricity_highest_consumption`
4. Update your `.env.local` with your Supabase URL and anon key

## Documentation

- The application uses a modular approach to manage different utility systems
- Each module has its own dedicated dashboard and API endpoints
- The dashboard connects to Supabase for real-time data
- The system is designed to expand with additional utility modules in the future

## License

This project is proprietary and confidential to Muscat Bay.
