interface LanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
  disabled?: boolean;
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
];

export function LanguageSelector({ language, onChange, disabled }: LanguageSelectorProps) {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-[#0d0d10] border border-[#2a2a35] text-gray-200 text-sm font-semibold rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 block pl-4 pr-10 py-2.5 transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:border-gray-500"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.id} value={lang.id}>{lang.name}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}
