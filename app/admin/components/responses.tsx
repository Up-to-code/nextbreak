// components/responses.tsx
export const ResponseRate = () => (
    <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-4 text-xl font-bold">Customer Responses</h2>
      <div className="mb-3">
        <div className="mb-2 flex justify-between">
          <span>Response Rate</span>
          <span className="font-bold">89%</span>
        </div>
        <div className="h-4 w-full rounded-full border-2 border-black">
          <div 
            className="h-full rounded-full bg-[#118AB2]" 
            style={{ width: '89%' }}
          ></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between">
          <span>Avg. Response Time</span>
          <span className="font-bold">2h 14m</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 text-sm">👍 84% Positive</div>
          <div className="text-sm">👎 16% Negative</div>
        </div>
      </div>
    </div>
  );