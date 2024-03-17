import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "@/app/baseUrl";
import { pgsql } from "@/database/pgsql";

export const POST = async (req: NextRequest) => {
    const { auth_id, key, clientsToo, salesmenToo } = (await req.json()) as { auth_id?: string; key?: string, clientsToo: boolean, salesmenToo: boolean};

    if (!auth_id || key !== process.env.SERVER_KEY) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    const { data: roleData, error: error1 } = await pgsql.query.users_restricted
        .findMany({
            where: (users_restricted, { eq }) => eq(users_restricted.user_id, auth_id),
            columns: {
                role: true,
            },
        })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error1) {
        return NextResponse.json(error1.message, { status: 500 });
    }

    if (!roleData || roleData.length === 0) {
        return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (roleData[0].role == "User") {
        return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { data: usersInfo, error: error2 } = await pgsql.query.users
        .findMany()
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error2) {
        return NextResponse.json(error2.message, { status: 500 });
    }

    const { data: usersRestricted, error: error3 } = await pgsql.query.users_restricted
        .findMany()
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));

    if (error3) {
        return NextResponse.json(error3.message, { status: 500 });
    }

    const users = usersInfo?.map((user) => {
        const restricted = usersRestricted?.find(
            (restricted) => restricted.user_id === user.user_id
        );
        return {
            ...user,
            ...restricted,
        };
    });

    const clients = users?.filter((user) => user.role === "User");
    const adminsAndSalesmen = users?.filter(
        (user) => user.role === "Admin" || user.role === "Salesman"
    );

    const userInfo = users?.find((user) => user.user_id === auth_id);

    if (roleData[0].role == "Admin") {
        return NextResponse.json({ ...(clientsToo && {clients}), ...(salesmenToo && {adminsAndSalesmen}), userInfo });
    }

    if (roleData[0].role == "Salesman") {
        return NextResponse.json({ ...(clientsToo && {clients}), userInfo });
    }
};
