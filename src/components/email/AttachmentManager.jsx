import { useState, useRef } from 'react';
import { Upload, File, Image, FileText, Trash2, Eye, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FILE_TYPES = {
  pdf:  { icon: FileText, color: 'text-red-500',  bg: 'bg-red-50' },
  doc:  { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  docx: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  png:  { icon: Image,    color: 'text-violet-500', bg: 'bg-violet-50' },
  jpg:  { icon: Image,    color: 'text-violet-500', bg: 'bg-violet-50' },
  jpeg: { icon: Image,    color: 'text-violet-500', bg: 'bg-violet-50' },
};

const SAMPLE_FILES = [
  { id: 1, name: 'RVNU_Platform_Deck.pdf',    size: '2.4 MB', type: 'pdf',  uploadedAt: '2d ago',    usedIn: 5 },
  { id: 2, name: 'Proposal_Template_Q3.docx', size: '184 KB', type: 'docx', uploadedAt: '1w ago',    usedIn: 2 },
  { id: 3, name: 'Company_Logo.png',          size: '48 KB',  type: 'png',  uploadedAt: '2w ago',    usedIn: 12 },
  { id: 4, name: 'Case_Study_Fintech.pdf',    size: '1.1 MB', type: 'pdf',  uploadedAt: '3w ago',    usedIn: 8 },
];

function UploadZone({ onUpload, uploading }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer group"
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" multiple className="hidden" onChange={e => onUpload(Array.from(e.target.files))} />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm font-medium text-slate-700">Uploading…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-100 border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center transition-colors">
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Drag & drop files here</p>
          <p className="text-[11px] text-slate-400">or click to browse — PDF, DOC, PNG, JPG up to 25 MB</p>
        </div>
      )}
    </div>
  );
}

export default function AttachmentManager() {
  const [files, setFiles] = useState(SAMPLE_FILES);
  const [uploading, setUploading] = useState(false);
  const [justUploaded, setJustUploaded] = useState(null);

  const handleUpload = (newFiles) => {
    setUploading(true);
    setTimeout(() => {
      const added = newFiles.map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.name.split('.').pop().toLowerCase(),
        uploadedAt: 'Just now',
        usedIn: 0,
      }));
      setFiles(prev => [...added, ...prev]);
      setUploading(false);
      setJustUploaded(added[0]?.id);
      setTimeout(() => setJustUploaded(null), 3000);
    }, 1600);
  };

  const handleRemove = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <div className="space-y-5">
      <UploadZone onUpload={handleUpload} uploading={uploading} />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Attachment Library</h3>
          <span className="text-[11px] text-slate-400">{files.length} files</span>
        </div>
        <div className="divide-y divide-slate-100">
          {files.map((f) => {
            const ext = f.type?.toLowerCase();
            const ft = FILE_TYPES[ext] || { icon: File, color: 'text-slate-400', bg: 'bg-slate-50' };
            const FileIcon = ft.icon;
            const isNew = justUploaded === f.id;
            return (
              <div key={f.id} className={cn('flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50', isNew && 'bg-emerald-50')}>
                <div className={cn('w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0', ft.bg)}>
                  <FileIcon className={cn('w-4 h-4', ft.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-slate-800 truncate">{f.name}</p>
                    {isNew && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400">{f.size} · Uploaded {f.uploadedAt} · Used in {f.usedIn} email{f.usedIn !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleRemove(f.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
          {files.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-400 text-xs">No attachments yet</div>
          )}
        </div>
      </div>
    </div>
  );
}