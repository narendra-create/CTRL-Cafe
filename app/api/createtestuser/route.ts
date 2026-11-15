import { createClient } from "@/lib/supabase/serverClient";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const email = body.email;
        const password = body.password;
        const name = body.name;
        if (!email || !password || !name) {
            return NextResponse.json({ message: "Please Provide all fields" }, { status: 400 })
        };

        await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });

        return NextResponse.json({ message: "Created" }, { status: 201 });
    }
    catch (err) {
        console.error("[createTestProfile]: ", err);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}