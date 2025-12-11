import ReactECharts from 'echarts-for-react';
import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

export default function ImprovementChart({ data, contestNames, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length < 2) return null;

    // Calculate improvement for students who participated in at least 2 contests
    const improvements = data
      .map(student => {
        const contestScores = contestNames
          .map(contest => student.contests[contest] || 0)
          .filter(score => score > 0);
        
        if (contestScores.length < 2) return null;
        
        const firstScore = contestScores[0];
        const lastScore = contestScores[contestScores.length - 1];
        const improvement = lastScore - firstScore;
        const improvementPercent = firstScore > 0 ? ((improvement / firstScore) * 100) : 0;
        
        return {
          name: student.name.split(' ')[0],
          improvement: Math.round(improvementPercent * 10) / 10,
          firstScore,
          lastScore
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => Math.abs(b.improvement) - Math.abs(a.improvement))
      .slice(0, 15);

    if (improvements.length === 0) return null;

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
        },
        formatter: (params) => {
          const data = params[0];
          const student = improvements[data.dataIndex];
          return `${student.name}<br/>First Score: ${student.firstScore}<br/>Latest Score: ${student.lastScore}<br/>Improvement: ${data.value}%`;
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
        type: 'value',
        name: 'Improvement %',
        nameTextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#e5e7eb'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: improvements.map(i => i.name),
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#e5e7eb'
          }
        }
      },
      series: [
        {
          name: 'Improvement',
          type: 'bar',
          data: improvements.map(i => i.improvement),
          itemStyle: {
            color: (params) => {
              const value = params.value;
              if (value > 0) {
                return {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#10b981' },
                    { offset: 1, color: '#059669' }
                  ]
                };
              } else {
                return {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#ef4444' },
                    { offset: 1, color: '#dc2626' }
                  ]
                };
              }
            },
            borderRadius: [0, 8, 8, 0]
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 11
          }
        }
      ]
    };
  }, [data, contestNames, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Overall Improvement
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Need at least 2 contests to show improvement
        </p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <h3 className="card-header flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        Top 15 Students - Overall Improvement (%)
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '500px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
