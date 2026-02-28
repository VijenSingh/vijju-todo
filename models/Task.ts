import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'To Do' | 'In Progress' | 'Done';
  completed?: boolean;
  isJiraTicket?: boolean;
  jiraTicketId?: string;
  jiraTicketUrl?: string;
  jiraStatus?: string; // Naya field Jira ke actual status ke liye
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
    isJiraTicket: { type: Boolean, default: false },
    jiraTicketId: { type: String },
    jiraTicketUrl: { type: String },
    jiraStatus: { type: String }, // Naya field schema mein
  },
  { timestamps: true }
);

const Task: Model<ITask> = (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>('Task', TaskSchema);

export default Task;