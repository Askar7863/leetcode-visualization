import ReactECharts from 'echarts-for-react';
import { Trophy } from 'lucide-react';
import { useMemo } from 'react';

export default function TopRankersCard({ data, isDark }) {
  const topRankers = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [data]);

  const option = useMemo(() => {
    if (topRankers.length === 0) return null;

    const names = topRankers.map((s, i) => `#${i + 1} ${s.name.split(' ')[0]}`);
    const ratings = topRankers.map(s => s.rating);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 12,
          fontWeight: 'bold'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#e5e7eb'
          }
        }
      },
      xAxis: {
        type: 'value',
        name: 'Rating',
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
      series: [
        {
          name: 'Rating',
          type: 'bar',
          data: ratings.map((rating, index) => ({
            value: rating,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: index === 0
                  ? [{ offset: 0, color: '#fbbf24' }, { offset: 1, color: '#f59e0b' }]
                  : index === 1
                  ? [{ offset: 0, color: '#94a3b8' }, { offset: 1, color: '#64748b' }]
                  : index === 2
                  ? [{ offset: 0, color: '#fb923c' }, { offset: 1, color: '#ea580c' }]
                  : [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#3b82f6' }]
              },
              borderRadius: [0, 10, 10, 0]
            }
          })),
          label: {
            show: true,
            position: 'right',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 13,
            fontWeight: 'bold'
          },
          barWidth: '60%'
        }
      ]
    };
  }, [topRankers, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Top 10 Rankings
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <h3 className="card-header flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        🏆 Top 10 Rankings
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '450px' }}
        opts={{ renderer: 'svg' }}
      />
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {topRankers.slice(0, 3).map((student, index) => (
          <div key={student.id} className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <div className="text-3xl mb-1">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </div>
            <div className="font-bold text-sm truncate">{student.name.split(' ')[0]}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating: {student.rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
