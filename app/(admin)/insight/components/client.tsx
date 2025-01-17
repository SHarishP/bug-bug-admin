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
import { InsightSchema } from "@/lib/schema";
import { columns, InsightsColumn } from "./column";

interface InsightClientProps {
  data: InsightsColumn[];
  onSuccess: () => void;
}

export const InsightsClient: React.FC<InsightClientProps> = ({
  data,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const initialValues = {
    name: "",
    category: "",
  };

  const fields = [
    { name: "name", label: "Insight Title", type: "text" },
    { name: "category", label: "Insight Category", type: "text" },
  ];

  const pathName = "New Insight";

  interface IInsight {
    name: string;
    category: string;
  }

  const onSubmit = async (values: IInsight) => {
    try {
      setLoading(true);
      // console.log(values);
      const { data } = await axiosInstance.post("/api/insight", values);
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
        validationSchema={InsightSchema}
        pathName={pathName}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Insights (${data.length})`}
          description="Manage Insights"
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
