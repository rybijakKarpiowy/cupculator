'use client'

import { Client, User } from "@/app/dashboard/page";
import { useEffect, useState } from "react";

export const DashboardPages = ({clients, adminsAndSalesmen, user} : {clients?: Client[], adminsAndSalesmen?: Client[], user: User}) => {
    const [chosenTab, setChosenTab] = useState("activationRequests");
    
    useEffect(() => {
        console.log(chosenTab);
    }, [chosenTab]);

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <button onClick={() => setChosenTab("activationRequests")}>Activation Requests</button>
                <button onClick={() => setChosenTab("clients")}>Clients</button>
                <button onClick={() => setChosenTab("admins")}>Admins</button>
                <button onClick={() => setChosenTab("salesmen")}>Salesmen</button>
            </div>
            <p>Logged in as {user?.email}</p>
            <p>Role: {user?.role}</p>
            {user?.role === "Admin" && (
                <ul>
                    {adminsAndSalesmen?.map((adminOrSalesman) => (
                        <li key={adminOrSalesman?.user_id}>{adminOrSalesman?.email}</li>
                    ))}
                </ul>
            )}
            {user?.role === "Admin" ||
                (user?.role === "Salesman" && (
                    <ul>
                        {clients?.map((client) => (
                            <li key={client.user_id}>{client.email}</li>
                        ))}
                    </ul>
                ))}
        </div>
    );
}