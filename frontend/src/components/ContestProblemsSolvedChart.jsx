import ReactECharts from 'echarts-for-react';
import { BarChart2 } from 'lucide-react';
import { useMemo } from 'react';

export default function ContestProblemsSolvedChart({ data, contestNames, selectedContest, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length === 0) return null;

    // Get the contests to display
    const displayContests = selectedContest && selectedContest !== 'all' 
      ? [selectedContest] 
      : contestNames;

    // For each contest, count how many students solved 0, 1, 2, 3, 4 problems
    // Using REAL data from spreadsheet contest columns (values: 0, 1, 2, 3, 4, N/A)
    const problemCategories = ['0 Problems', '1 Problem', '2 Problems', '3 Problems', '4 Problems'];
    const seriesData = problemCategories.map(() => []);

    displayContests.forEach((contest, contestIndex) => {
      const counts = [0, 0, 0, 0, 0]; // 0, 1, 2, 3, 4 problems
      
      data.forEach(student => {
        const problemsSolved = student.contests[contest];
        
        // Handle the actual values from spreadsheet: 0, 1, 2, 3, 4, N/A
        // N/A, null, undefined, or 0 all count as 0 problems
        if (problemsSolved === null || problemsSolved === undefined || 
            problemsSolved === 'N/A' || problemsSolved === 0) {
          counts[0]++;
        } else if (problemsSolved === 1) {
          counts[1]++;
        } else if (problemsSolved === 2) {
          counts[2]++;
        } else if (problemsSolved === 3) {
          counts[3]++;
        } else if (problemsSolved >= 4) {
          counts[4]++;
        }
      });

      problemCategories.forEach((_, i) => {
        seriesData[i].push(counts[i]);
      });
    });

    const colors = ['#ef4444', '#f97316', '#fbbf24', '#34d399', '#3b82f6'];

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: { color: isDark ? '#f3f4f6' : '#111827' }
      },
      legend: {
        data: problemCategories,
        bottom: '3%',
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: displayContests.map(c => c.length > 20 ? c.substring(0, 20) + '...' : c),
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: displayContests.length > 3 ? 30 : 0,
          fontSize: 11
        },
        axisLine: {
          lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Number of Students',
        nameTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
        axisLabel: { color: isDark ? '#9ca3af' : '#6b7280' },
        splitLine: {
          lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      },
      series: problemCategories.map((name, index) => ({
        name,
        type: 'bar',
        stack: 'total',
        data: seriesData[index],
        itemStyle: {
          color: colors[index],
          borderRadius: index === problemCategories.length - 1 ? [4, 4, 0, 0] : 0
        },
        emphasis: {
          focus: 'series'
        }
      }))
    };
  }, [data, contestNames, selectedContest, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-green-500" />
          Problems Solved Per Contest
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No contest data available
        </p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <h3 className="card-header flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-green-500" />
        Problems Solved Distribution Per Contest
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
