import CreatorSidebar from "@/components/CreatorSidebar";


export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-primary/10 gap-3 min-h-screen">
      {/* Fixed sidebar */}
      <CreatorSidebar />

      {/* Main content takes remaining width */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
