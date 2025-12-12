import BrandSidebar from "@/components/BrandSidebar";
import BlockBrandDashboard from "@/components/BlockBrandDashboard";


export default function BrandDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-primary/10 gap-3 min-h-screen">
      <BlockBrandDashboard />
      {/* Fixed sidebar */}
      <BrandSidebar />

      {/* Main content takes remaining width */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
