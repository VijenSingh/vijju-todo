import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'To Do' | 'In Progress' | 'Done';
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent recompilation / model overwrite in dev
const Task: Model<ITask> = (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
