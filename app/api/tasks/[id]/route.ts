// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';

// TypeScript ke liye params ka type define karna
interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, props: Params) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const body = await request.json();
    
    // Task ko ID ke basis par update karna
    const updatedTask = await Task.findByIdAndUpdate(params.id, body, { returnDocument: 'after' });
    
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PUT Task Error:", error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: Params) {
  try {
    const params = await props.params;
    await connectToDatabase();
    
    const deletedTask = await Task.findByIdAndDelete(params.id);
    
    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("DELETE Task Error:", error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}