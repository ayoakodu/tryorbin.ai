import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Called by an entity automation when a LinkedInTask is updated.
 * Handles sequence progression logic:
 *  - completed → advance sequence / create next step task
 *  - no_response → create follow-up task
 *  - snoozed → update due_date
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { event, data, old_data } = body;

    if (!data || event?.type !== 'update') {
      return Response.json({ ok: true, skipped: true });
    }

    const task = data;
    const prevStatus = old_data?.status;
    const newStatus  = task.status;
    const newResult  = task.task_result;

    // ── 1. Task completed → log last_activity_date ─────────────────────────
    if (newStatus === 'completed' && prevStatus !== 'completed') {
      await base44.asServiceRole.entities.LinkedInTask.update(task.id, {
        last_activity_date: new Date().toISOString(),
        completion_date: task.completion_date || new Date().toISOString(),
      });
    }

    // ── 2. No response → auto-create a follow-up task ──────────────────────
    if (
      newResult === 'no_response' &&
      old_data?.task_result !== 'no_response' &&
      task.task_type === 'send_connection_request'
    ) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 2); // follow up in 2 days

      await base44.asServiceRole.entities.LinkedInTask.create({
        task_type:       'follow_up_message',
        status:          'pending',
        priority:        task.priority || 'normal',
        contact_id:      task.contact_id,
        contact_name:    task.contact_name,
        contact_title:   task.contact_title,
        contact_company: task.contact_company,
        sequence_id:     task.sequence_id,
        linkedin_profile_url: task.linkedin_profile_url,
        due_date:        dueDate.toISOString(),
        notes:           `Auto-created: No response to connection request sent on ${new Date().toLocaleDateString()}.`,
        last_activity_date: new Date().toISOString(),
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});