/**
 * LinkedIn deep-linking utilities for RVNU.
 * Opens safe links in new tabs — no hidden automation.
 */

export function openLinkedInProfile(profileUrl) {
  if (!profileUrl) return;
  const url = profileUrl.startsWith('http') ? profileUrl : `https://www.linkedin.com/in/${profileUrl}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openLinkedInMessaging(profileUrl) {
  if (!profileUrl) return;
  // Opens the messaging page; user must send manually
  const base = 'https://www.linkedin.com/messaging/';
  window.open(base, '_blank', 'noopener,noreferrer');
}

export function openLinkedInSearch(query) {
  const encoded = encodeURIComponent(query || '');
  window.open(`https://www.linkedin.com/search/results/people/?keywords=${encoded}`, '_blank', 'noopener,noreferrer');
}

export function openLinkedInCompanyPage(companyPageUrl) {
  if (!companyPageUrl) return;
  const url = companyPageUrl.startsWith('http') ? companyPageUrl : `https://www.linkedin.com/company/${companyPageUrl}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openLinkedInPost(postUrl) {
  if (!postUrl) return;
  window.open(postUrl, '_blank', 'noopener,noreferrer');
}

export const TASK_TYPE_LABELS = {
  send_connection_request: 'Connection Request',
  send_linkedin_message:   'LinkedIn Message',
  view_profile:            'Profile Visit',
  engage_with_post:        'Engage With Post',
  follow_up_message:       'Follow-Up',
  reply_reminder:          'Reply Reminder',
  visit_company_page:      'Company Page Visit',
};

export const TASK_TYPE_DESCRIPTIONS = {
  send_connection_request: 'Send a personalised connection request on LinkedIn.',
  send_linkedin_message:   'Send a direct LinkedIn message to this prospect.',
  view_profile:            'Visit the prospect\'s LinkedIn profile.',
  engage_with_post:        'Like or comment on a recent post.',
  follow_up_message:       'Send a follow-up message after no response.',
  reply_reminder:          'Remind yourself to reply or follow up on a conversation.',
  visit_company_page:      'Visit the prospect\'s company LinkedIn page.',
};

export const TASK_TYPE_ICONS = {
  send_connection_request: 'UserPlus',
  send_linkedin_message:   'MessageCircle',
  view_profile:            'Eye',
  engage_with_post:        'ThumbsUp',
  follow_up_message:       'CornerDownRight',
  reply_reminder:          'Bell',
  visit_company_page:      'Building2',
};

export const STATUS_LABELS = {
  pending:   'Pending',
  completed: 'Completed',
  overdue:   'Overdue',
  skipped:   'Skipped',
  snoozed:   'Snoozed',
};

export const RESULT_LABELS = {
  accepted:    'Accepted',
  no_response: 'No Response',
  declined:    'Declined',
  completed:   'Completed',
  replied:     'Replied',
};