import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <div className="flex items-center space-x-3">
      {/* Icon with background */}
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            {/* Chart line */}
            <path
              d="M3 18 L7 16 L11 20 L15 14 L19 12 L21 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            
            {/* F letter */}
            <path
              d="M8 6 L8 18 M8 6 L14 6 M8 10 L12 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent leading-none">
          Fluxpool
        </span>
        <span className="text-xs text-gray-400 font-medium leading-none">
          Trading Platform
        </span>
      </div>
    </div>
  );
}