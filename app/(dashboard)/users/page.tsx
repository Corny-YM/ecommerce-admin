import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { Column } from "./components/columns";
import { Client } from "./components/client";

const UsersPage = async () => {
  const customers = await prismadb.user.findMany({
    include: { _count: { select: { orders: true } } },
  });

  const formatted: Column[] = customers.map((customers) => ({
    imageUrl: customers.imageUrl,
    firstName: customers.firstName,
    lastName: customers.lastName,
    fullName: customers.fullName,
    email: customers.email,
    quantity: customers._count.orders,
    lastSignInAt: format(customers.lastSignInAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <Client data={formatted} />
      </div>
    </div>
  );
};

export default UsersPage;
