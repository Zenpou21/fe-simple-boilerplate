import { Card, CardBody } from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";

/** A placeholder home page. Replace it with your own widgets. */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Dashboard" description={`Welcome back, ${user?.name}.`} />
      <Card>
        <CardBody className="text-sm text-default-600">
          This is the starter dashboard. Open <b>Products</b> in the menu to see a full CRUD example
          (table with search, sort, filters and paging, plus an Add / View / Edit drawer and Delete).
        </CardBody>
      </Card>
    </div>
  );
}
