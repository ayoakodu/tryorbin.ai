import { useState, useRef } from 'react';
import { Mic, Play, Pause, Loader2, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function VoiceNotePlayer({ note }) {
  const [playing, setPlaying] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState(note.transcript || null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const togglePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      setProgress(0);
      const duration = note.duration || 12;
      let elapsed = 0;
      intervalRef.current = setInterval(() => {
        elapsed++;
        setProgress((elapsed / duration) * 100);
        if (elapsed >= duration) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          setProgress(0);
        }
      }, 1000);
    }
  };

  const transcribe = async () => {
    setTranscribing(true);
    // Simulate transcription with AI for demo
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Simulate a realistic transcription of a short WhatsApp voice note from a B2B prospect in ${note.context || 'Nigeria'}. 
The note is from ${note.sender || 'a prospect'} and is about ${note.topic || 'following up on a sales inquiry'}.
Write ONLY the transcribed text as if it were spoken, naturally, 1-3 sentences. No explanation.`,
    });
    setTranscript(result);
    setTranscribing(false);
    setShowTranscript(true);
  };

  const duration = note.duration || 12;
  const elapsed = Math.round((progress / 100) * duration);
  const remaining = duration - elapsed;

  return (
    <div className="max-w-[72%] bg-primary/10 border border-primary/20 rounded-2xl rounded-bl-sm px-4 py-3">
      <div className="flex items-center gap-3">
        <button onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          {playing
            ? <Pause className="w-3.5 h-3.5 text-primary-foreground" />
            : <Play className="w-3.5 h-3.5 text-primary-foreground ml-0.5" />
          }
        </button>

        <div className="flex-1">
          <div className="w-full bg-border rounded-full h-1.5 mb-1">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-1">
            <Mic className="w-2.5 h-2.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">
              {playing ? `${elapsed}s` : `${duration}s`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        {transcript ? (
          <button onClick={() => setShowTranscript(!showTranscript)}
            className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            {showTranscript ? 'Hide' : 'Show'} transcript
          </button>
        ) : (
          <button onClick={transcribe} disabled={transcribing}
            className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1">
            {transcribing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <FileText className="w-2.5 h-2.5" />}
            {transcribing ? 'Transcribing...' : 'Transcribe with AI'}
          </button>
        )}
      </div>

      {showTranscript && transcript && (
        <div className="mt-2 p-2 rounded-lg bg-secondary/50 border border-border/30">
          <p className="text-[11px] text-muted-foreground italic">"{transcript}"</p>
        </div>
      )}
    </div>
  );
}