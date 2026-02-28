import { NextResponse } from 'next/server';
import axios from 'axios';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET() {
  try {
    await connectToDatabase();

    const domain = process.env.JIRA_DOMAIN;
    const email = process.env.JIRA_EMAIL;
    const token = process.env.JIRA_API_TOKEN;

    if (!domain || !email || !token) {
      return NextResponse.json({ error: 'Jira credentials missing in .env.local' }, { status: 400 });
    }

    const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;
    const auth = Buffer.from(`${email}:${token}`).toString('base64');

    const jiraApiUrl = `${baseUrl}/rest/api/3/search/jql`;
    const jqlQuery = '(assignee = currentUser() OR reporter = currentUser() OR watcher = currentUser() OR text ~ currentUser()) AND statusCategory != Done';

    const response = await axios.post(
      jiraApiUrl,
      {
        jql: jqlQuery,
        fields: ['summary', 'status'] // Yahan hum status bhi fetch kar rahe hain
      },
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    const issues = response.data.issues || [];
    let newSyncedCount = 0;

    for (const issue of issues) {
      // Jira se actual status ka text nikalna (e.g., "In Progress")
      const actualJiraStatus = issue.fields.status?.name || 'Open';
      
      const existingTask = await Task.findOne({ jiraTicketId: issue.key });
      
      if (!existingTask) {
        // Naya task banate waqt jiraStatus bhi save karein
        await Task.create({
          title: `[${issue.key}] ${issue.fields.summary}`,
          description: "Auto-synced from Jira 🔄",
          status: "To Do",
          isJiraTicket: true,
          jiraTicketId: issue.key,
          jiraTicketUrl: `${baseUrl}/browse/${issue.key}`,
          jiraStatus: actualJiraStatus 
        });
        newSyncedCount++;
      } else {
        // Agar task pehle se hai, toh check karein ki kya Jira par status change hua hai?
        if (existingTask.jiraStatus !== actualJiraStatus) {
          existingTask.jiraStatus = actualJiraStatus;
          await existingTask.save();
        }
      }
    }

    return NextResponse.json({ 
      message: `Sync successful! ${newSyncedCount} new tickets added.`,
      count: newSyncedCount
    });

  } catch (error: any) {
    console.error("Jira Sync Error:", error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to sync Jira tickets' }, { status: 500 });
  }
}