"use client";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { InsightsColumn } from "./components/column";
import { InsightsClient } from "./components/client";

interface IInsight {
  id: string;
  name: string;
  category: {
    name: string;
  };
  user: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const InsightPage = () => {
  const [insights, setInsights] = useState<IInsight[]>([]);

  // Get all insights
  const getAllInsights = async () => {
    try {
      const { data } = await axiosInstance.get("api/insights");
      setInsights(data.insights);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getAllInsights();
  }, []);

  const formattedInsights: InsightsColumn[] = insights.map((insight) => ({
    id: insight.id,
    name: insight.name,
    category: insight.category.name,
    createdBy: insight.user.name,
    createdAt: format(insight.createdAt, "MMM do, yyyy"),
    updatedAt: format(insight.updatedAt, "MMM do, yyyy"),
  }));
  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InsightsClient data={formattedInsights} onSuccess={getAllInsights} />
      </div>
    </div>
  );
};

export default InsightPage;
