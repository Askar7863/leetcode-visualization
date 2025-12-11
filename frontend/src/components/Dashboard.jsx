import { useState, useMemo, useEffect } from 'react';
import { useSheetData, useStats } from '../hooks/useSheetData';
import { 
  sortData, 
  filterData
} from '../utils/dataProcessor';
import FilterBar from './FilterBar';
import ProblemsSolvedDistribution from './ProblemsSolvedDistribution';
import RatingDistribution from './RatingDistribution';
import AverageScoreChart from './AverageScoreChart';
import ContestChart from './ContestChart';
import WeeklyProgressChart from './WeeklyProgressChart';
import ContestProblemsSolvedChart from './ContestProblemsSolvedChart';
import NonAttendanceChart from './NonAttendanceChart';
import ThemeToggle from './ThemeToggle';
import { Users, Award, Target, TrendingUp, AlertCircle, Loader } from 'lucide-react';

export default function Dashboard() {
  const { data, contestNames, lastUpdated, isLoading, isError, refresh } = useSheetData();
  const { stats, isLoading: statsLoading } = useStats();
  
  // Debug logging
  useEffect(() => {
    console.log('Dashboard Data:', { 
      dataLength: data?.length, 
      contestNames, 
      hasData: !!data,
      isLoading,
      isError
    });
  }, [data, contestNames, isLoading, isError]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedContest, setSelectedContest] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Monitor dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    setIsDark(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  // Process data for filtering
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let filtered = filterData(data, searchTerm);
    return sortData(filtered, sortBy);
  }, [data, searchTerm, sortBy]);

  // Filter data by selected contest
  const contestFilteredData = useMemo(() => {
    if (!selectedContest || selectedContest === 'all') return processedData;
    
    // Only include students who participated in the selected contest
    return processedData.filter(student => 
      student.contests[selectedContest] && student.contests[selectedContest] > 0
    );
  }, [processedData, selectedContest]);

  // Get active contest names for charts
  const activeContestNames = useMemo(() => {
    if (!selectedContest || selectedContest === 'all') return contestNames;
    return [selectedContest];
  }, [selectedContest, contestNames]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to fetch data from the server. Please ensure the backend is running.
          </p>
          <button onClick={handleRefresh} className="btn-primary">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                LeetCode Contest Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time tracking of student performance and contest results
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents || 0}</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Problems/Student</p>
                <p className="text-2xl font-bold">{stats.averageProblems || 0}</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</p>
                <p className="text-2xl font-bold">{stats.averageAttendance || 0}%</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contests</p>
                <p className="text-2xl font-bold">{stats.contestCount || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedContest={selectedContest}
          onContestChange={setSelectedContest}
          contestNames={contestNames}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
        />

        {/* Row 1: Overall Solved Distribution & Overall Rating Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Overall Solved Distribution - uses real data from 'Problems Solved' column - FILTER INDEPENDENT */}
          <ProblemsSolvedDistribution data={data} isDark={isDark} />
          
          {/* Right: Overall Rating Distribution - uses real data from 'Contest Rating' column - FILTER INDEPENDENT */}
          <RatingDistribution data={data} isDark={isDark} />
        </div>

        {/* Row 2: Contest Performance & Average Score */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Keep existing chart - Contest Performance */}
          <ContestChart 
            data={contestFilteredData} 
            contestNames={activeContestNames} 
            selectedContest={selectedContest}
            isDark={isDark}
          />
          
          {/* Right: Average Score of Contest - uses computed average from real contest scores */}
          <AverageScoreChart
            data={contestFilteredData}
            contestNames={activeContestNames}
            selectedContest={selectedContest}
            isDark={isDark}
          />
        </div>

        {/* Row 3: Weekly Comparison - uses real weekly data */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <WeeklyProgressChart 
            data={contestFilteredData} 
            contestNames={activeContestNames}
            isDark={isDark}
          />
        </div>

        {/* Row 4: Problems Solved Per Contest & Contest Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Problems Solved Distribution Per Contest - uses real contest problem data */}
          <ContestProblemsSolvedChart 
            data={contestFilteredData}
            contestNames={activeContestNames}
            selectedContest={selectedContest}
            isDark={isDark}
          />
          
          {/* Right: Contest Attendance & Participation - uses real attendance data */}
          <NonAttendanceChart 
            data={processedData}
            contestNames={activeContestNames}
            selectedContest={selectedContest}
            isDark={isDark}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Dashboard updates automatically every 30 seconds • Last updated: {' '}
            {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </p>
          <p className="mt-2">
            Built with React, TailwindCSS, ECharts & Google Sheets API
          </p>
        </footer>
      </div>
    </div>
  );
}
