"use client";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modals";
import axiosInstance from "@/lib/axios";
import { FormModal } from "@/components/modals/form-modals";
import { ProductSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const router = useRouter();

  // function to copy productId
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Product ID copied to clipboard");
  };

  // function to delete product
  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/api/product?id=${data.id}`);
      toast.success(response.data?.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  // for updating product
  interface IProduct {
    name: string;
    desc: string;
  }
  const initialValues = {
    name: "",
    desc: "",
  };
  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "desc", label: "Description", type: "text" },
  ];
  const onSubmit = async (values: IProduct) => {
    try {
      const response = await axiosInstance.patch(
        `/api/product?id=${data.id}`,
        values
      );
      toast.success(response.data?.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUpdateOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <FormModal
        isOpen={updateOpen}
        onClose={() => setUpdateOpen(false)}
        onConfirm={onSubmit}
        loading={loading}
        fields={fields}
        initialValues={initialValues}
        validationSchema={ProductSchema}
        pathName="Update Product"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
