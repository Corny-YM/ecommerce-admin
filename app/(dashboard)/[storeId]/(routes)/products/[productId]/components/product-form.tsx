"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrigin } from "@/hooks/use-origin";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

type ProductFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData?.price)) }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, values);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/products`);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    value={field.value.map((img) => img.url)}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((cur) => cur.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="9.99"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a category"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Size */}
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a size"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes?.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Color */}
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a color"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors?.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Feature */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {/* Archived */}
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
