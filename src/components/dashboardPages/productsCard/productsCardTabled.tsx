"use client";

import { Database } from "@/database/types";
import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const ProductsCardTabled = ({
    cupsData,
}: {
    cupsData: Database["public"]["Tables"]["cups"]["Row"][];
}) => {
    const [loading, setLoading] = useState(false);

    return (
        <DataTable columns={columns} data={cupsData} loading={loading} setLoading={setLoading} />
    );
};
