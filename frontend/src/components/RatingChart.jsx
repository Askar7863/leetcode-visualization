import ReactECharts from 'echarts-for-react';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export default function RatingChart({ data, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    const topStudents = data.slice(0, 15);
    const names = topStudents.map(s => s.name.split(' ')[0]);
    const ratings = topStudents.map(s => s.rating);

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
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: 45,
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#e5e7eb'
          }
        }
      },
      yAxis: {
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
          data: ratings,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#1d4ed8' }
              ]
            },
            borderRadius: [8, 8, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 11
          },
          animationDelay: (idx) => idx * 50
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 20
    };
  }, [data, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Top Ratings
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
        <TrendingUp className="w-5 h-5 text-blue-500" />
        Top 15 Students by Rating
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
