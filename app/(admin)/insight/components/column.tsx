"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";

export interface InsightsColumn {
  id: string;
  name: string;
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const columns: ColumnDef<InsightsColumn>[] = [
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
