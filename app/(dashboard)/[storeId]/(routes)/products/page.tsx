import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    include: {
      images: true,
      // categoryHasProducts: { include: { category: true } },
      productHasSizes: { include: { size: true } },
      productHasColors: { include: { color: true } },
    },
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    images: item.images,
    sizes: item.productHasSizes.map(item => item.size),
    colors: item.productHasColors.map(item => item.color),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
