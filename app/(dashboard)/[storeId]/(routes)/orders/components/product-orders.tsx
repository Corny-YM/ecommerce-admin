"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as TypeImage, Product, Size, Color } from "@prisma/client";

import { getProductSold } from "@/actions/get-products-sold";
import { useOrderContext } from "@/providers/orders-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NoImg from "@/public/imgs/no-img.jpg";
import { cn } from "@/lib/utils";

interface Props {
  storeId: string;
}

const ProductOrders = ({ storeId }: Props) => {
  const { pathname } = useOrderContext();
  const [selected, setSelected] = useState("all");
  const [products, setProducts] = useState<
    (Product & {
      size: Size;
      color: Color;
      images: TypeImage[];
      quantity: number;
    })[]
  >([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getProductSold(storeId);
      setProducts(res || []);
    };
    fetch();
  }, []);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = target.dataset.id;
      if (!id || !storeId || id === selected) return;
      const res = await getProductSold(storeId, id);
      setProducts(res || []);
      setSelected(id);
    },
    [storeId, selected]
  );

  const tabs = useMemo(() => {
    return [
      { label: "All", id: "all" },
      { label: "Months", id: "months" },
      { label: "Weeks", id: "weeks" },
      { label: "Days", id: "days" },
    ];
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            data-id={tab.id}
            className={cn(
              "w-24 hover:bg-[#3498db]",
              selected === tab.id && "bg-[#3498db]"
            )}
            size="sm"
            onClick={handleClick}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {products.map((product) => (
          <Link
            className="w-full flex justify-between gap-2 p-4 border border-solid shadow rounded-lg hover:bg-primary/20 transition cursor-pointer"
            target="_blank"
            href={`/${storeId}/products/${product.id}`}
          >
            <div className="relative w-10 h-10 flex justify-center items-center rounded-lg overflow-hidden">
              <Image
                className="absolute w-full h-full"
                src={product?.images?.[0]?.url || NoImg}
                alt={product.name}
                fill
              />
            </div>
            <div className="flex-1 flex flex-col text-sm gap-2">
              <div className="font-semibold line-clamp-1">{product.name}</div>
              <div className="w-full flex items-center flex-wrap gap-2">
                <div>
                  Quantity:{" "}
                  <Badge className="px-2">{product.quantity || 0}</Badge>
                </div>
                <div>
                  Size:{" "}
                  <Badge className="px-2">{product.size.value || 0}</Badge>
                </div>
                <div>
                  Color:{" "}
                  <Badge
                    className="px-2"
                    style={{ backgroundColor: product.color.value }}
                  >
                    {product.color.value}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductOrders;
