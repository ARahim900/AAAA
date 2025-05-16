import { DashboardLayout } from "@/components/layout/dashboard-layout";
import StpPlantDashboard from "@/features/stp-plant/components/stp-plant-dashboard"; // Ensure this path is correct

export default function StpPlantPage() {
  return (
    <DashboardLayout title="STP Plant Management" subtitle="Sewage Treatment Plant Analytics">
      <StpPlantDashboard />
    </DashboardLayout>
  );
}

