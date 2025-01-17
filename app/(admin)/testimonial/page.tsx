"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TestimonialClient } from "./components/client";
import { TestimonialColumn } from "./components/columns";

interface ITestimonial {
  id: string;
  customer: string;
  position: string;
  comment: string;
  user: {
    name: string;
  };
}

const TestimonialPage = () => {
  const [testimonials, setTestimonial] = useState<ITestimonial[]>([]);

  // Get all testimonials
  const getAllTestimonials = async () => {
    try {
      const { data } = await axiosInstance.get("/api/testimonials");
      setTestimonial(data.testimonials);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getAllTestimonials();
  }, []);

  const formattedTestimonials: TestimonialColumn[] = testimonials.map(
    (testimonial) => ({
      id: testimonial.id,
      name: testimonial.customer,
      position: testimonial.position,
      comment: testimonial.comment,
    })
  );
  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TestimonialClient
          data={formattedTestimonials}
          onSuccess={getAllTestimonials}
        />
      </div>
    </div>
  );
};

export default TestimonialPage;
