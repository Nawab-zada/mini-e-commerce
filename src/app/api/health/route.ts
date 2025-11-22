import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json(
            { status: 'success', message: 'Database connection established' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { status: 'error', message: 'Database connection failed', error: (error as Error).message },
            { status: 500 }
        );
    }
}
