import ReactECharts from 'echarts-for-react';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export default function WeeklyProgressChart({ data, contestNames, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length === 0) return null;

    // Calculate weekly participation and average scores
    const weeklyData = contestNames.map(contest => {
      const participants = data.filter(s => s.contests[contest] > 0);
      const avgScore = participants.length > 0
        ? participants.reduce((sum, s) => sum + (s.contests[contest] || 0), 0) / participants.length
        : 0;
      
      return {
        contest: contest.length > 20 ? contest.substring(0, 20) + '...' : contest,
        participants: participants.length,
        avgScore: Math.round(avgScore * 10) / 10
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827'
        }
      },
      legend: {
        data: ['Participants', 'Average Score'],
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        top: '5%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: weeklyData.map(d => d.contest),
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: 45,
          fontSize: 10
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#e5e7eb'
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Participants',
          position: 'left',
          nameTextStyle: {
            color: isDark ? '#9ca3af' : '#6b7280'
          },
          axisLabel: {
            color: isDark ? '#9ca3af' : '#6b7280'
          },
          splitLine: {
            lineStyle: {
              color: isDark ? '#374151' : '#e5e7eb'
            }
          }
        },
        {
          type: 'value',
          name: 'Avg Score',
          position: 'right',
          nameTextStyle: {
            color: isDark ? '#9ca3af' : '#6b7280'
          },
          axisLabel: {
            color: isDark ? '#9ca3af' : '#6b7280'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Participants',
          type: 'line',
          data: weeklyData.map(d => d.participants),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#3b82f6'
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
          symbolSize: 8
        },
        {
          name: 'Average Score',
          type: 'line',
          yAxisIndex: 1,
          data: weeklyData.map(d => d.avgScore),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#10b981'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
              ]
            }
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    };
  }, [data, contestNames, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Weekly Progress Trend
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
        <TrendingUp className="w-5 h-5 text-green-500" />
        Weekly Progress & Participation Trend
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
