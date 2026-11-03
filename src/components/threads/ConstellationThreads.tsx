import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import threadsData from '../../../content/threads.json';

interface ConstellationThreadsProps {
  onSelectArtwork?: (slug: string) => void;
  activeArtworkId?: string;
}

export default function ConstellationThreads({ activeArtworkId }: ConstellationThreadsProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const threads = threadsData.threads || [];
  const activeThread = threads.find((t) => t.id === selectedThreadId);

  return (
    <div className="dusk-constellation-panel">
      <div className="dusk-constellation-bar">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`dusk-constellation-toggle ${isExpanded ? 'active' : ''}`}
          aria-expanded={isExpanded}
        >
          <Sparkles size={14} className="dusk-constellation-icon" />
          <span>MEMORY & MYTH THREADS</span>
          <span className="dusk-constellation-count">{threads.length}</span>
        </button>

        {isExpanded && (
          <div className="dusk-constellation-pills">
            {threads.map((thread) => {
              const isActive = selectedThreadId === thread.id;
              const matchesArtwork = activeArtworkId
                ? thread.artworkIds.includes(activeArtworkId)
                : false;

              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThreadId(isActive ? null : thread.id)}
                  className={`dusk-thread-pill ${isActive ? 'selected' : ''} ${matchesArtwork ? 'linked' : ''}`}
                  style={{
                    borderColor: isActive ? thread.color : undefined,
                  }}
                >
                  <span className="thread-dot" style={{ backgroundColor: thread.color }} />
                  <span className="thread-title">{thread.name}</span>
                </button>
              );
            })}
            {selectedThreadId && (
              <button
                type="button"
                onClick={() => setSelectedThreadId(null)}
                className="dusk-thread-clear"
                title="Clear selected thread"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {isExpanded && activeThread && (
        <div className="dusk-thread-card">
          <div className="dusk-thread-card-header">
            <span className="dusk-thread-motif-label">SHARED MOTIF / PIGMENT</span>
            <h4 className="dusk-thread-card-name">{activeThread.name}</h4>
          </div>
          <p className="dusk-thread-card-desc">{activeThread.description}</p>
          <div className="dusk-thread-card-meta">
            <span className="dusk-thread-motif">"{activeThread.motif}"</span>
            <span className="dusk-thread-works-count">
              Connects {activeThread.artworkIds.length} Works
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
