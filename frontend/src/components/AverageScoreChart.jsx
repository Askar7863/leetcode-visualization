import ReactECharts from 'echarts-for-react';
import { LineChart } from 'lucide-react';
import { useMemo } from 'react';

export default function AverageScoreChart({ data, contestNames, selectedContest, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length === 0) return null;

    // Get the contests to display
    const displayContests = selectedContest && selectedContest !== 'all' 
      ? [selectedContest] 
      : contestNames;

    // Calculate average score for each contest
    const averageScores = displayContests.map(contest => {
      const participants = data.filter(s => s.contests[contest] && s.contests[contest] > 0);
      const avgScore = participants.length > 0
        ? participants.reduce((sum, s) => sum + (s.contests[contest] || 0), 0) / participants.length
        : 0;
      
      return {
        contest: contest.length > 20 ? contest.substring(0, 20) + '...' : contest,
        avgScore: Math.round(avgScore * 10) / 10
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827'
        },
        formatter: (params) => {
          const item = params[0];
          return `${item.axisValue}<br/>Avg Score: ${item.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: averageScores.map(d => d.contest),
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
        name: 'Average Score',
        nameTextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        splitLine: {
          lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      },
      series: [
        {
          name: 'Average Score',
          type: 'line',
          data: averageScores.map(d => d.avgScore),
          smooth: true,
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#8b5cf6' }
              ]
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
              ]
            }
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#3b82f6'
          },
          label: {
            show: true,
            position: 'top',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 11,
            formatter: '{c}'
          }
        }
      ]
    };
  }, [data, contestNames, selectedContest, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <LineChart className="w-5 h-5 text-blue-500" />
          Average Contest Score
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
        <LineChart className="w-5 h-5 text-blue-500" />
        Average Contest Score
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
