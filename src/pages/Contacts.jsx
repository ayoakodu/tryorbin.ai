import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Sparkles, Mail, Phone,
  Linkedin, MapPin, Loader2, MessageCircle, Pencil, Trash2
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ContactCopilotPanel from '@/components/copilot/ContactCopilotPanel';
import { invokeLLM } from '@/lib/ai';

const statusColors = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  nurturing: 'bg-violet-50 text-violet-700 border-violet-200',
  converted: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  lost: 'bg-red-50 text-red-700 border-red-200',
};

const intentColors = {
  hot: 'text-red-600', warm: 'text-amber-600', cold: 'text-blue-600', unknown: 'text-muted-foreground',
};

const sampleContacts = [
  { id: 's1', first_name: 'Amara', last_name: 'Diallo', email: 'amara@flutterwave.com', title: 'VP Sales', company: 'Flutterwave', country: 'Nigeria', status: 'qualified', intent_signal: 'hot', lead_score: 92, industry: 'Fintech', linkedin_url: 'https://linkedin.com/in/amara', phone: '+234 801 234 5678' },
  { id: 's2', first_name: 'Tunde', last_name: 'Okafor', email: 'tunde@paystack.com', title: 'Head of Growth', company: 'Paystack', country: 'Nigeria', status: 'contacted', intent_signal: 'warm', lead_score: 78, industry: 'Fintech', phone: '+234 802 345 6789' },
  { id: 's3', first_name: 'Kefilwe', last_name: 'Mthembu', email: 'k.mthembu@yoco.com', title: 'CMO', company: 'Yoco', country: 'South Africa', status: 'new', intent_signal: 'warm', lead_score: 65, industry: 'Payments', phone: '+27 71 234 5678' },
  { id: 's4', first_name: 'Chioma', last_name: 'Eze', email: 'chioma@andela.com', title: 'Revenue Lead', company: 'Andela', country: 'Nigeria', status: 'nurturing', intent_signal: 'hot', lead_score: 88, industry: 'Tech', phone: '+234 803 456 7890' },
  { id: 's5', first_name: 'Kweku', last_name: 'Mensah', email: 'kweku@wave.com', title: 'CFO', company: 'Wave', country: 'Ghana', status: 'qualified', intent_signal: 'warm', lead_score: 74, industry: 'Fintech', phone: '+233 24 567 8901' },
  { id: 's6', first_name: 'Aisha', last_name: 'Kamara', email: 'aisha@moniepoint.com', title: 'BD Director', company: 'Moniepoint', country: 'Nigeria', status: 'converted', intent_signal: 'hot', lead_score: 96, industry: 'Fintech', phone: '+234 805 678 9012' },
];



export default function Contacts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', title: '', company: '', country: '', status: 'new' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date', 100),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setShowAdd(false);
      setForm({ first_name: '', last_name: '', email: '', title: '', company: '', country: '', status: 'new' });
      toast({ title: 'Contact added!' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setEditContact(null);
      toast({ title: 'Contact updated!' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast({ title: 'Contact deleted.' });
    }
  });

  const [followUpSuggestion, setFollowUpSuggestion] = useState(null); // { contactId, loading, text, action, draft }
  const [showFollowUpDraft, setShowFollowUpDraft] = useState(false);

  const suggestFollowUp = async (contact, e) => {
    e.stopPropagation();
    setFollowUpSuggestion({ contactId: contact.id, loading: true });
    try {
      const result = await invokeLLM({
        prompt: `You are a B2B GTM AI copilot helping a sales rep in African markets.

Contact: ${contact.first_name} ${contact.last_name}, ${contact.title || 'Decision Maker'} at ${contact.company || 'their company'} (${contact.country || 'Africa'})
Status: ${contact.status}, Intent: ${contact.intent_signal || 'unknown'}, Lead score: ${contact.lead_score || 'unknown'}

Suggest the single most impactful next action to move this deal forward. Return JSON with:
- action: short action label (e.g. "Send follow-up email", "Book a demo call", "Send case study")
- reasoning: one sentence explaining why
- email_subject: suggested subject line if the action involves email
- email_draft: a short 3-paragraph email draft personalized to this contact (if relevant)`,
        response_json_schema: { type: 'object', properties: {}, required: [] },
      });
      setFollowUpSuggestion({ contactId: contact.id, loading: false, ...result });
    } catch {
      setFollowUpSuggestion({ contactId: contact.id, loading: false, error: true });
    }
  };

  const openEdit = (contact, e) => {
    e.stopPropagation();
    setEditContact(contact);
    setEditForm({ first_name: contact.first_name, last_name: contact.last_name, email: contact.email, title: contact.title || '', company: contact.company || '', country: contact.country || '', status: contact.status || 'new' });
  };

  const displayContacts = contacts.length > 0 ? contacts : sampleContacts;
  const filtered = displayContacts.filter(c => {
    const matchSearch = search === '' || `${c.first_name} ${c.last_name} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Contacts" subtitle={`${displayContacts.length} contacts · Click any contact for AI personalization`} />

      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts..." className="pl-10 bg-secondary/50 border-border/50" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-secondary/50 border-border/50"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAdd(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: displayContacts.length, color: 'text-foreground' },
            { label: 'Hot Leads', value: displayContacts.filter(c => c.intent_signal === 'hot').length, color: 'text-red-400' },
            { label: 'Qualified', value: displayContacts.filter(c => c.status === 'qualified').length, color: 'text-primary' },
            { label: 'Converted', value: displayContacts.filter(c => c.status === 'converted').length, color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className={`font-bold text-xs ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Intent</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Score</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">AI</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((contact, i) => (
                    <motion.tr key={contact.id || contact.email} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedContact(contact)}
                      className="border-b border-border/20 hover:bg-secondary/30 transition-colors group cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {contact.first_name[0]}{contact.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-xs text-foreground">{contact.first_name} {contact.last_name}</p>
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-xs font-medium">{contact.company || '—'}</p>
                        <p className="text-xs text-muted-foreground">{contact.title || ''}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />{contact.country || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[contact.status] || statusColors.new}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${contact.intent_signal === 'hot' ? 'bg-red-400' : contact.intent_signal === 'warm' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                          <span className={`text-xs capitalize ${intentColors[contact.intent_signal] || 'text-muted-foreground'}`}>{contact.intent_signal || 'unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        {contact.lead_score ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${contact.lead_score}%` }} />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">{contact.lead_score}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.stopPropagation(); setSelectedContact(contact); }}
                            className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary" title="AI Copilot">
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={e => suggestFollowUp(contact, e)}
                            className="p-1.5 rounded-md hover:bg-violet-50 text-muted-foreground hover:text-violet-600 text-[10px] font-medium" title="Suggest Follow-up">
                            {followUpSuggestion?.contactId === contact.id && followUpSuggestion?.loading
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                              : <Mail className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => openEdit(contact, e)} className="p-1.5 rounded-md hover:bg-slate-100 text-muted-foreground hover:text-slate-700">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {!contact.id.toString().startsWith('s') && (
                            <button onClick={e => { e.stopPropagation(); deleteMutation.mutate(contact.id); }} className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contact AI Copilot Panel */}
      <AnimatePresence>
        {selectedContact && (
          <ContactCopilotPanel contact={selectedContact} onClose={() => setSelectedContact(null)} />
        )}
      </AnimatePresence>

      {/* Follow-up Suggestion Panel */}
      <AnimatePresence>
        {followUpSuggestion && !followUpSuggestion.loading && !followUpSuggestion.error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-violet-50/60">
              <span className="text-xs font-bold text-violet-700 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Follow-up Suggestion</span>
              <button onClick={() => setFollowUpSuggestion(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{followUpSuggestion.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{followUpSuggestion.reasoning}</p>
                </div>
              </div>
              {followUpSuggestion.email_draft && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  {followUpSuggestion.email_subject && (
                    <p className="text-[11px] font-semibold text-foreground mb-1">Subject: {followUpSuggestion.email_subject}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground whitespace-pre-line leading-relaxed">{followUpSuggestion.email_draft}</p>
                </div>
              )}
              <div className="flex gap-2">
                {followUpSuggestion.email_draft && (
                  <button onClick={() => {
                    sessionStorage.setItem('compose_prefill', JSON.stringify({
                      subject: followUpSuggestion.email_subject || '',
                      body: followUpSuggestion.email_draft || '',
                    }));
                    window.location.href = '/emails';
                  }} className="flex-1 h-8 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 flex items-center justify-center gap-1.5">
                    <Mail className="w-3 h-3" /> Open in Emails
                  </button>
                )}
                <button onClick={() => setFollowUpSuggestion(null)} className="flex-1 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted">
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Contact Dialog */}
      <Dialog open={!!editContact} onOpenChange={open => !open && setEditContact(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">First Name</Label>
                <Input value={editForm.first_name || ''} onChange={e => setEditForm(p => ({ ...p, first_name: e.target.value }))} className="bg-secondary/50 border-border/60" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Last Name</Label>
                <Input value={editForm.last_name || ''} onChange={e => setEditForm(p => ({ ...p, last_name: e.target.value }))} className="bg-secondary/50 border-border/60" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Email</Label>
              <Input value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="bg-secondary/50 border-border/60" type="email" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Title</Label>
                <Input value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="bg-secondary/50 border-border/60" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Company</Label>
                <Input value={editForm.company || ''} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} className="bg-secondary/50 border-border/60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Country</Label>
                <Input value={editForm.country || ''} onChange={e => setEditForm(p => ({ ...p, country: e.target.value }))} className="bg-secondary/50 border-border/60" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Status</Label>
                <Select value={editForm.status || 'new'} onValueChange={v => setEditForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger className="bg-secondary/50 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditContact(null)} className="flex-1 border-border/60">Cancel</Button>
              <Button onClick={() => updateMutation.mutate({ id: editContact.id, data: editForm })} className="flex-1 bg-primary text-primary-foreground" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle>Add New Contact</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">First Name</Label>
                <Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="bg-secondary/50 border-border/60" placeholder="Amara" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Last Name</Label>
                <Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="bg-secondary/50 border-border/60" placeholder="Diallo" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-secondary/50 border-border/60" placeholder="amara@company.com" type="email" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-secondary/50 border-border/60" placeholder="VP Sales" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Company</Label>
                <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-secondary/50 border-border/60" placeholder="Flutterwave" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Country</Label>
              <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="bg-secondary/50 border-border/60" placeholder="Nigeria" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1 border-border/60">Cancel</Button>
              <Button onClick={() => createMutation.mutate(form)} className="flex-1 bg-primary text-primary-foreground" disabled={createMutation.isPending || !form.first_name || !form.email}>
                {createMutation.isPending ? 'Adding...' : 'Add Contact'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}