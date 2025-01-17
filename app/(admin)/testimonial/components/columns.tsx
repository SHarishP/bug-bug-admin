"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";

export interface TestimonialColumn {
  id: string;
  name: string;
  position: string;
  comment: string;
}

export const columns: ColumnDef<TestimonialColumn>[] = [
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "comment",
    header: "Review",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
