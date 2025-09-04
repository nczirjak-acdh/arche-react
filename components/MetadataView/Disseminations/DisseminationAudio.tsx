'use client';

import { useRef, useState, useEffect } from 'react';

export default function DisseminationAudio({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  // cleanup blob URL
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // keep volume synced
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // reset button when playback finishes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => setIsPlaying(false);
    a.addEventListener('ended', onEnded);
    return () => a.removeEventListener('ended', onEnded);
  }, []);

  const downloadToBlobUrl = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(src, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const buf = await resp.arrayBuffer();
      const blob = new Blob([buf], {
        type: resp.headers.get('content-type') || 'audio/wav',
      });
      const url = URL.createObjectURL(blob);
      setObjectUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
      if (audioRef.current) {
        audioRef.current.src = url;
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onToggle = async () => {
    const a = audioRef.current;
    if (!a) return;

    if (!objectUrl) {
      await downloadToBlobUrl();
    }

    if (!a.src) return;

    if (isPlaying) {
      a.pause();
      a.currentTime = 0;
      setIsPlaying(false);
    } else {
      try {
        await a.play();
        setIsPlaying(true);
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  return (
    <div className="p-4 border rounded-xl flex flex-col gap-3 max-w-sm">
      <button
        onClick={onToggle}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-50"
      >
        {loading ? 'Loading…' : isPlaying ? 'Stop' : 'Play'}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Vol</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
