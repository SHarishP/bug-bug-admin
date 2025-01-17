"use client";
import { Heading } from "@/components/heading";
import { columns, CategoriesColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormModal } from "@/components/modals/form-modals";
import { useState } from "react";
import { CategorySchema } from "@/lib/schema";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface CategoryClientProps {
  data: CategoriesColumns[];
  onSuccess: () => void;
}

export const CategoriesClient: React.FC<CategoryClientProps> = ({
  data,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const initialValues = {
    name: "",
  };

  const fields = [{ name: "name", label: "Category Name", type: "text" }];

  const pathName = "Category";
  interface ICategory {
    name: string;
  }
  const onSubmit = async (values: ICategory) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/api/category", values);
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
        validationSchema={CategorySchema}
        pathName={pathName}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage Categories"
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
