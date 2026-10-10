import { NextResponse } from 'next/server';
import cloudinary from '@/lib/setup-files/cloudinary.config';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { folder } = body;

        // Get current time in seconds
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Generate the signature
        // IMPORTANT: Any params you add here (like folder) MUST match exactly
        // what you append to the FormData on the client later.
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: folder || 'ctrl_cafe_default_folder',
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({ timestamp, signature });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}