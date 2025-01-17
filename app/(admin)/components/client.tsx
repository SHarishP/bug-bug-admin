"use client";

import { Heading } from "@/components/heading";
import { columns, ProductColumn } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormModal } from "@/components/modals/form-modals";
import { useState } from "react";
import { ProductSchema } from "@/lib/schema";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

interface ProductClientProps {
  data: ProductColumn[];
  onSuccess: () => void;
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initialValues = {
    name: "",
    desc: "",
  };

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "desc", label: "Description", type: "text" },
  ];

  const pathName = "product";

  interface IProduct {
    name: string;
    desc: string;
  }

  const onSubmit = async (values: IProduct) => {
    try {
      setLoading(true);
      // console.log(values);
      const { data } = await axiosInstance.post("/api/product", values);
      toast.success(data.message);
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <FormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onSubmit}
        loading={loading}
        fields={fields}
        initialValues={initialValues}
        validationSchema={ProductSchema}
        pathName={pathName}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Product (${data.length})`}
          description="Manage Product"
        />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable data={data} columns={columns} searchKey="name" />
    </>
  );
};
