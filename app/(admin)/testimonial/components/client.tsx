"use client";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormModal } from "@/components/modals/form-modals";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { TestimonialSchema } from "@/lib/schema";
import { columns, TestimonialColumn } from "./columns";

interface TestimonialClientProps {
  data: TestimonialColumn[];
  onSuccess: () => void;
}

export const TestimonialClient: React.FC<TestimonialClientProps> = ({
  data,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  const pathName = "Customer's Review";

  interface ITestimonial {
    customer: string;
    position: string;
    comment: string;
  }

  const onSubmit = async (values: ITestimonial) => {
    try {
      setLoading(true);
      // console.log(values);
      const { data } = await axiosInstance.post("/api/testimonial", values);
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
        validationSchema={TestimonialSchema}
        pathName={pathName}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Customer's Review (${data.length})`}
          description="Manage Reviews"
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
