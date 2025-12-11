import ReactECharts from 'echarts-for-react';
import { PieChart } from 'lucide-react';
import { useMemo } from 'react';

export default function ProblemsSolvedDistribution({ data, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Categorize students by problems solved
    // Using ranges: 0-100, 100-300, 300-500, 500-800, >800
    const categories = {
      '0-100': 0,
      '100-300': 0,
      '300-500': 0,
      '500-800': 0,
      '>800': 0
    };

    data.forEach(student => {
      const problems = student.problemsSolved || 0;
      if (problems < 100) {
        categories['0-100']++;
      } else if (problems < 300) {
        categories['100-300']++;
      } else if (problems < 500) {
        categories['300-500']++;
      } else if (problems < 800) {
        categories['500-800']++;
      } else {
        categories['>800']++;
      }
    });

    const pieData = Object.entries(categories)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827'
        },
        formatter: '{b}: {c} students ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11
        },
        itemGap: 15
      },
      series: [
        {
          name: 'Problems Solved',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: isDark ? '#1f2937' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{d}%',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 12
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              formatter: '{b}\n{c} ({d}%)'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: pieData,
          color: ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
        }
      ]
    };
  }, [data, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-500" />
          Problems Solved Distribution
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
        <PieChart className="w-5 h-5 text-blue-500" />
        Overall Problems Solved Distribution
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
