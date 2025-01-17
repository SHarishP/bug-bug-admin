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
import { TestimonialColumn } from "./columns";
import { TestimonialSchema } from "@/lib/schema";

interface CellActionProps {
  data: TestimonialColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  // function to copy productId
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Testimonial ID copied to clipboard");
  };

  // function to delete testimonial
  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/api/testimonial?id=${data.id}`
      );
      toast.success(response.data?.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  // for updating testimonial
  interface ITestimonial {
    customer: string;
    position: string;
    comment: string;
  }
  const initialValues = {
    customer: "",
    position: "",
    comment: "",
  };
  const fields = [
    { name: "customer", label: "Customer's Name", type: "text" },
    { name: "position", label: "Customer's Position", type: "text" },
    { name: "comment", label: "Customer's Review", type: "text" },
  ];
  const onSubmit = async (values: ITestimonial) => {
    try {
      const response = await axiosInstance.patch(
        `/api/testimonial?id=${data.id}`,
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
        validationSchema={TestimonialSchema}
        pathName="Update Review"
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
