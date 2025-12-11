import ReactECharts from 'echarts-for-react';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

export default function HeatmapChart({ data, contestNames, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length === 0) return null;

    // Take top 10 students and all contests
    const topStudents = [...data]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    const students = topStudents.map(s => s.name.split(' ')[0]);
    const contests = contestNames.map(c => 
      c.length > 15 ? c.substring(0, 15) + '...' : c
    );

    // Create heatmap data
    const heatmapData = [];
    topStudents.forEach((student, studentIdx) => {
      contestNames.forEach((contest, contestIdx) => {
        const score = student.contests[contest] || 0;
        heatmapData.push([contestIdx, studentIdx, score]);
      });
    });

    // Find max score for color scaling
    const maxScore = Math.max(...heatmapData.map(d => d[2]));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        position: 'top',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827'
        },
        formatter: function (params) {
          return `${students[params.data[1]]}<br/>${contestNames[params.data[0]]}<br/>Score: ${params.data[2]}`;
        }
      },
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '5%'
      },
      xAxis: {
        type: 'category',
        data: contests,
        splitArea: {
          show: true
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'category',
        data: students,
        splitArea: {
          show: true
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      },
      visualMap: {
        min: 0,
        max: maxScore,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      },
      series: [
        {
          name: 'Contest Score',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            fontSize: 9,
            color: isDark ? '#f3f4f6' : '#111827'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }, [data, contestNames, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Performance Heatmap
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
        <Activity className="w-5 h-5 text-red-500" />
        Contest Performance Heatmap (Top 10 Students)
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '500px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
