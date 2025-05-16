import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ContractorDashboard from "@/features/contractors/components/contractor-dashboard"; // Ensure this path is correct

export default function ContractorsPage() {
  return (
    <DashboardLayout title="Contractor Tracker" subtitle="Manage and Monitor Contractor Agreements">
      <ContractorDashboard />
    </DashboardLayout>
  );
}

