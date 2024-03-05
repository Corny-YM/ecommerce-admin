interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  return <div>This is a dashboard</div>;
};

export default DashboardPage;
