"use client";
import { ProductClient } from "./components/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductColumn } from "./components/columns";
import toast from "react-hot-toast";

// define the structure of the products
interface IProducts {
  id: string;
  name: string;
  desc: string;
  user: {
    name: string;
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<IProducts[]>([]);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      // console.log(data.products);
      setProducts(data.products);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.desc,
    userName: product.user.name,
  }));
  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} onSuccess={getAllProducts} />
      </div>
    </div>
  );
}
