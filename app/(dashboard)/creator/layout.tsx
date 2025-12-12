import CreatorSidebar from "@/components/CreatorSidebar";
import BlockCreatorDashboard from "@/components/BlockCreatorDashboard";


export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-primary/10 gap-3 min-h-screen">
      <BlockCreatorDashboard />
      {/* Fixed sidebar */}
      <CreatorSidebar />

      {/* Main content takes remaining width */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
