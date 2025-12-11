import { Trophy, Award, Target, TrendingUp } from 'lucide-react';
import { getMedalEmoji, getRankBadgeClass } from '../utils/dataProcessor';

export default function Leaderboard({ data, selectedContest }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h2 className="card-header flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <h2 className="card-header flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        {selectedContest ? `${selectedContest} - Leaderboard` : 'Overall Leaderboard'}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                LeetCode ID
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" />
                  Rating
                </div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-center gap-1">
                  <Target className="w-4 h-4" />
                  Problems
                </div>
              </th>
              {selectedContest && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Score
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((student, index) => (
              <tr
                key={student.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMedalEmoji(student.rank)}</span>
                    <span className={`badge ${getRankBadgeClass(student.rank)}`}>
                      #{student.rank}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {student.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {student.registerNumber}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`https://leetcode.com/${student.leetcodeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm"
                  >
                    {student.leetcodeId}
                  </a>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-semibold">
                    {student.rating}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold">
                    {student.problemsSolved}
                  </span>
                </td>
                {selectedContest && (
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
                      {student.contestScore || 0}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No participants found for this contest
        </div>
      )}
    </div>
  );
}
