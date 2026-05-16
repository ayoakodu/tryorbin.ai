import { useState } from 'react';
import { MessageSquare, Send, AtSign, Trash2 } from 'lucide-react';

const teamMembers = ['Kofi', 'Fatima', 'David', 'Amina', 'Seun'];

const initialComments = [
  { id: 1, author: 'Kofi', initials: 'KA', text: 'Had a great discovery call — they\'re serious buyers. Budget confirmed.', time: '2h ago', color: 'bg-primary/20 text-primary' },
  { id: 2, author: 'Fatima', initials: 'FB', text: '@David can you send the proposal template for enterprise deals?', time: '1h ago', color: 'bg-violet-500/20 text-violet-400' },
];

export default function TeamComments({ entityId, entityType }) {
  const [comments, setComments] = useState(initialComments);
  const [input, setInput] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const addComment = () => {
    if (!input.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(), author: 'You', initials: 'ME', text: input,
      time: 'Just now', color: 'bg-cyan-500/20 text-cyan-400'
    }]);
    setInput('');
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    setShowMentions(val.includes('@') && val.endsWith('@'));
  };

  const insertMention = (name) => {
    setInput(prev => prev.replace(/@$/, `@${name} `));
    setShowMentions(false);
  };

  const formatWithMentions = (text) =>
    text.replace(/@(\w+)/g, '<span class="text-primary font-semibold">@$1</span>');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Team Comments ({comments.length})
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto mb-3 max-h-48">
        {comments.map(c => (
          <div key={c.id} className="flex gap-2.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${c.color}`}>
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-semibold text-foreground">{c.author}</span>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatWithMentions(c.text) }} />
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        {showMentions && (
          <div className="absolute bottom-full left-0 mb-1 w-40 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-10">
            {teamMembers.map(name => (
              <button key={name} onClick={() => insertMention(name)}
                className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                {name}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={handleInput}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addComment(); } }}
              placeholder="Add a comment... use @ to mention"
              className="w-full bg-secondary/50 border border-border/60 rounded-lg pl-3 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
            <AtSign className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <button onClick={addComment} disabled={!input.trim()}
            className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}