// Sort data by different criteria
export function sortData(data, sortBy) {
  if (!data || data.length === 0) return [];
  
  const sorted = [...data];
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'problems':
      return sorted.sort((a, b) => b.problemsSolved - a.problemsSolved);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

// Filter data by search term
export function filterData(data, searchTerm) {
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter(student => 
    student.name.toLowerCase().includes(term) ||
    student.leetcodeId.toLowerCase().includes(term) ||
    student.registerNumber.toLowerCase().includes(term)
  );
}

// Get top performers
export function getTopPerformers(data, count = 10) {
  if (!data || data.length === 0) return [];
  return sortData(data, 'rating').slice(0, count);
}

// Calculate contest statistics
export function getContestStats(data, contestName) {
  if (!data || data.length === 0 || !contestName) return null;
  
  const scores = data
    .map(student => student.contests[contestName] || 0)
    .filter(score => score > 0);
  
  if (scores.length === 0) return null;
  
  return {
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    max: Math.max(...scores),
    min: Math.min(...scores),
    participants: scores.length,
  };
}

// Get rating distribution
export function getRatingDistribution(data) {
  if (!data || data.length === 0) return [];
  
  const ranges = [
    { label: '0-500', min: 0, max: 500, count: 0 },
    { label: '501-1000', min: 501, max: 1000, count: 0 },
    { label: '1001-1500', min: 1001, max: 1500, count: 0 },
    { label: '1501-2000', min: 1501, max: 2000, count: 0 },
    { label: '2000+', min: 2001, max: Infinity, count: 0 },
  ];
  
  data.forEach(student => {
    const rating = student.rating;
    const range = ranges.find(r => rating >= r.min && rating <= r.max);
    if (range) range.count++;
  });
  
  return ranges;
}

// Get problems solved distribution
export function getProblemsDistribution(data) {
  if (!data || data.length === 0) return [];
  
  const ranges = [
    { label: '0-50', min: 0, max: 50, count: 0 },
    { label: '51-100', min: 51, max: 100, count: 0 },
    { label: '101-200', min: 101, max: 200, count: 0 },
    { label: '201-300', min: 201, max: 300, count: 0 },
    { label: '300+', min: 301, max: Infinity, count: 0 },
  ];
  
  data.forEach(student => {
    const problems = student.problemsSolved;
    const range = ranges.find(r => problems >= r.min && problems <= r.max);
    if (range) range.count++;
  });
  
  return ranges;
}

// Get contest leaderboard for a specific contest
export function getContestLeaderboard(data, contestName) {
  if (!data || data.length === 0 || !contestName) return [];
  
  return data
    .map(student => ({
      ...student,
      contestScore: student.contests[contestName] || 0,
    }))
    .filter(student => student.contestScore > 0)
    .sort((a, b) => b.contestScore - a.contestScore)
    .map((student, index) => ({
      ...student,
      rank: index + 1,
    }));
}

// Get rating trend data for a specific student
export function getStudentRatingTrend(data, studentId, contestNames) {
  if (!data || !studentId || !contestNames) return [];
  
  const student = data.find(s => s.leetcodeId === studentId);
  if (!student) return [];
  
  return contestNames.map(contestName => ({
    contest: contestName,
    score: student.contests[contestName] || 0,
  }));
}

// Get overall leaderboard with ranks
export function getOverallLeaderboard(data) {
  if (!data || data.length === 0) return [];
  
  return sortData(data, 'rating').map((student, index) => ({
    ...student,
    rank: index + 1,
  }));
}

// Format date/time
export function formatDateTime(isoString) {
  if (!isoString) return 'Never';
  
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  return date.toLocaleString();
}

// Get medal emoji based on rank
export function getMedalEmoji(rank) {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '';
  }
}

// Get badge class based on rank
export function getRankBadgeClass(rank) {
  switch (rank) {
    case 1: return 'badge-gold';
    case 2: return 'badge-silver';
    case 3: return 'badge-bronze';
    default: return 'badge-blue';
  }
}

// Calculate performance metrics
export function calculatePerformanceMetrics(data, contestNames) {
  if (!data || data.length === 0) return null;
  
  const totalContests = contestNames.length;
  const totalStudents = data.length;
  
  // Calculate average participation rate
  let totalParticipation = 0;
  contestNames.forEach(contest => {
    const participants = data.filter(s => s.contests[contest] > 0).length;
    totalParticipation += participants;
  });
  
  const avgParticipation = totalContests > 0 
    ? (totalParticipation / (totalContests * totalStudents)) * 100 
    : 0;
  
  // Calculate average contest score
  let totalScore = 0;
  let scoreCount = 0;
  data.forEach(student => {
    Object.values(student.contests).forEach(score => {
      if (score > 0) {
        totalScore += score;
        scoreCount++;
      }
    });
  });
  
  const avgContestScore = scoreCount > 0 ? totalScore / scoreCount : 0;
  
  return {
    avgParticipation: avgParticipation.toFixed(1),
    avgContestScore: avgContestScore.toFixed(1),
    totalContests,
    totalStudents,
  };
}
