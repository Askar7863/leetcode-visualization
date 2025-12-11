import { Search, RefreshCw, Filter } from 'lucide-react';

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedContest,
  onContestChange,
  contestNames,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) {
  return (
    <div className="card mb-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, LeetCode ID, or register number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Sort By */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-field pl-10 pr-4 appearance-none cursor-pointer"
          >
            <option value="rating">Sort by Rating</option>
            <option value="problems">Sort by Problems</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Contest Filter */}
        <select
          value={selectedContest}
          onChange={(e) => onContestChange(e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="">All Contests</option>
          {contestNames.map((contest) => (
            <option key={contest} value={contest}>
              {contest}
            </option>
          ))}
        </select>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}
