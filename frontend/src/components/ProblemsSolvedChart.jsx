import ReactECharts from 'echarts-for-react';
import { Target } from 'lucide-react';
import { useMemo } from 'react';

export default function ProblemsSolvedChart({ data, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    const topSolvers = [...data]
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 15);
    
    const names = topSolvers.map(s => s.name.split(' ')[0]);
    const problems = topSolvers.map(s => s.problemsSolved);

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
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#e5e7eb'
          }
        }
      },
      xAxis: {
        type: 'value',
        name: 'Problems Solved',
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
          name: 'Problems Solved',
          type: 'bar',
          data: problems,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#10b981' },
                { offset: 1, color: '#059669' }
              ]
            },
            borderRadius: [0, 8, 8, 0]
          },
          label: {
            show: true,
            position: 'right',
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
          <Target className="w-5 h-5 text-green-500" />
          Problems Solved
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
        <Target className="w-5 h-5 text-green-500" />
        Top 15 Problem Solvers
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
