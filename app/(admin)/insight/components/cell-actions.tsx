"use client";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modals";
import axiosInstance from "@/lib/axios";
import { FormModal } from "@/components/modals/form-modals";
import { InsightsColumn } from "./column";
import { InsightSchema } from "@/lib/schema";

interface CellActionProps {
  data: InsightsColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  // function to copy InsightId
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Insight ID copied to clipboard");
  };

  // function to delete Insight
  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/api/insight?id=${data.id}`);
      toast.success(response.data?.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };
  //   for updating insight
  interface IInsight {
    name: string;
    category: string;
  }
  const initialValues = {
    name: "",
    category: "",
  };
  const fields = [
    { name: "name", label: "Insight Title", type: "text" },
    { name: "category", label: "Insight Category", type: "text" },
  ];
  const onSubmit = async (values: IInsight) => {
    try {
      const response = await axiosInstance.patch(
        `/api/insight?id=${data.id}`,
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
        validationSchema={InsightSchema}
        pathName="Insight Update"
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
