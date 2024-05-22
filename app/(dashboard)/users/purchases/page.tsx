import { format } from "date-fns";
import { User } from "@prisma/client";

import prismadb from "@/lib/prismadb";
import { Column } from "../components/columns";
import { Client } from "../components/client";

const UsersPurchase = async () => {
  const customers: (User & { quantity: number })[] = await prismadb.$queryRaw`
    SELECT user.*, COUNT(order.id) as quantity 
    FROM user
    LEFT JOIN \`order\` ON \`order\`.userId = user.id
    GROUP BY user.id
    HAVING COUNT(\`order\`.id) > 0
  `;

  const formatted: Column[] = customers.map((customers) => ({
    imageUrl: customers.imageUrl,
    firstName: customers.firstName,
    lastName: customers.lastName,
    fullName: customers.fullName,
    email: customers.email,
    quantity: Number(customers.quantity || 0),
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

export default UsersPurchase;
