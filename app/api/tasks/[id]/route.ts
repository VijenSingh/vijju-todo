import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';

// PUT: Task ko update karne ke liye
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Yahan Promise add kiya
) {
  try {
    await connectToDatabase();
    
    // Naye Next.js ke hisaab se params ko await karna zaroori hai
    const { id } = await params; 
    
    const body = await request.json();
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE: Task ko delete karne ke liye
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Yahan Promise add kiya
) {
  try {
    await connectToDatabase();
    
    // Naye Next.js ke hisaab se params ko await karna zaroori hai
    const { id } = await params;
    
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}