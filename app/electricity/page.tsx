import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ElectricityDashboard from "@/features/electricity/components/electricity-dashboard"; // Ensure this path is correct

export default function ElectricityPage() {
  return (
    <DashboardLayout title="Electricity Management" subtitle="Real-time Electricity Analytics Dashboard">
      <ElectricityDashboard />
    </DashboardLayout>
  );
}
