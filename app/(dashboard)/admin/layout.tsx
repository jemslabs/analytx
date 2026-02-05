
import AdminSidebar from "@/components/AdminSidebar";
import BlockAdminDashboard from "@/components/BlockAdminDashboard";


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-primary/10 gap-3 min-h-screen">
      <BlockAdminDashboard />
      {/* Fixed sidebar */}
      <AdminSidebar />

      {/* Main content takes remaining width */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
