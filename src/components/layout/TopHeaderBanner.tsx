/**
 * Top Banner Component for Header Area
 * A slim banner that appears above the main header
 */

import { CleanBanner } from "../ads";

export function TopHeaderBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <CleanBanner
          title="Advertisement"
          className="py-2 bg-transparent border-none"
        />
      </div>
    </div>
  );
}
