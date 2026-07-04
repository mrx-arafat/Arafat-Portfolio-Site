/** Terminal-window header used across blog pages. */
export function TerminalHeader({
  path,
  command,
}: {
  path: string;
  command: string;
}) {
  return (
    <div className="mb-8 bg-[#0f0f0f] border border-[#2ed573]/30 rounded-lg p-3 shadow-[0_0_15px_rgba(46,213,115,0.2)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
        <div className="ml-2 text-[#2ed573]/70 text-xs">{path}</div>
      </div>
      <div className="flex items-center">
        <span className="text-[#2ed573] mr-2">$</span>
        <span className="text-[#2ed573]">{command}</span>
        <span className="animate-blink ml-1 text-[#2ed573]">|</span>
      </div>
    </div>
  );
}
