import { NextResponse } from 'next/server';
import cloudinary from '@/lib/setup-files/cloudinary.config';
import { createClient } from '@/lib/supabase/serverClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { folder, public_id } = body;
        const supabase = await createClient();
        const claims = await supabase.auth.getClaims();
        if (!claims.data) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get current time in seconds
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Generate the signature
        // IMPORTANT: Any params you add here (like folder) MUST match exactly
        // what you append to the FormData on the client later.
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: folder || 'ctrl_cafe_default_folder',
                public_id
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({ timestamp, signature, public_id });
    } catch (error) {
        console.error("clodinary sign error", error);
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}