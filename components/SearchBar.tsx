"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Suggestion {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

interface SearchBarProps {
  onSubmit: (query: string, horizon: number, period: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSubmit, loading }: SearchBarProps) {
  const [query, setQuery] = useState("AAPL");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    const qTrimmed = q.trim();
    if (qTrimmed.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoadingSuggestions(false);
      return;
    }
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingSuggestions(true);
    setShowDropdown(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(qTrimmed)}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        setSuggestions([]);
        return;
      }
      const data: Suggestion[] = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setShowDropdown(true);
    } catch {
      // ignore (includes AbortError)
      setSuggestions([]);
      setShowDropdown(true);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(value.trim()), 400);
  };

  const selectSuggestion = (s: Suggestion) => {
    setQuery(s.symbol);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowDropdown(false);
    const form = new FormData(e.currentTarget);
    const horizon = parseInt(form.get("horizon") as string) || 7;
    const period = (form.get("period") as string) || "6mo";
    if (query.trim()) onSubmit(query.trim(), horizon, period);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#101a33] rounded-xl p-5 mb-6">
      <h2 className="text-[#93c5fd] text-sm font-bold mb-4">Analysis settings</h2>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1 relative" ref={wrapperRef}>
          <label className="text-xs text-slate-400">Symbol / Company</label>
          <input
            name="query"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query.trim().length > 0 && !showDropdown && fetchSuggestions(query)}
            onKeyDown={handleKeyDown}
            className="bg-[#0f172a] text-slate-100 border border-slate-700 rounded-lg px-3 py-2 w-56 text-sm focus:outline-none focus:border-blue-500"
          />
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 mt-1 w-72 bg-[#0f172a] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <li
                  key={s.symbol}
                  onMouseDown={() => selectSuggestion(s)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors ${
                    i === activeIndex ? "bg-blue-600/30" : "hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-blue-400 font-semibold shrink-0">{s.symbol}</span>
                    <span className="text-slate-300 truncate">{s.name}</span>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0 ml-2">{s.exchange}</span>
                </li>
              ))}
            </ul>
          )}
          {showDropdown && suggestions.length === 0 && (
            <ul className="absolute top-full left-0 mt-1 w-72 bg-[#0f172a] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <li className="px-3 py-2 text-sm text-slate-400">
                {loadingSuggestions ? "Searching..." : "No matches found."}
              </li>
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Forecast horizon (trading days)</label>
          <input
            name="horizon"
            type="number"
            defaultValue={7}
            min={1}
            max={60}
            className="bg-[#0f172a] text-slate-100 border border-slate-700 rounded-lg px-3 py-2 w-20 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Price history</label>
          <select
            name="period"
            defaultValue="6mo"
            className="bg-[#0f172a] text-slate-100 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="1mo">1 month</option>
            <option value="3mo">3 months</option>
            <option value="6mo">6 months</option>
            <option value="1y">1 year</option>
            <option value="2y">2 years</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-2 text-sm transition-colors"
        >
          {loading ? "Analyzing..." : "Run prediction"}
        </button>
      </div>
    </form>
  );
}
