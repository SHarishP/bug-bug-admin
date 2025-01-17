"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CategoriesClient } from "./components/client";
import { CategoriesColumns } from "./components/columns";

interface ICategory {
  id: string;
  name: string;
  user: {
    name: string;
  };
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/api/categories");
      setCategories(data.categories);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const formattedCategories: CategoriesColumns[] = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      createdBy: category.user.name,
    })
  );
  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient
          data={formattedCategories}
          onSuccess={getAllCategories}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
