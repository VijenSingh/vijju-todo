// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task'; // Ensure karein ki ye path sahi ho

export async function GET() {
  try {
    await connectToDatabase();
    // Saare tasks fetch karenge, naye tasks upar aayenge (descending order)
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Naya task database mein create karna
    const newTask = await Task.create(body);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}