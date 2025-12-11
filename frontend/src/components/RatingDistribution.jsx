import ReactECharts from 'echarts-for-react';
import { Award } from 'lucide-react';
import { useMemo } from 'react';

export default function RatingDistribution({ data, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Categorize students by contest rating
    const categories = {
      '0 Rating': 0,
      '1-500': 0,
      '501-1000': 0,
      '1001-1500': 0,
      '1501-2000': 0,
      '2000+': 0
    };

    data.forEach(student => {
      const rating = student.rating;
      if (!rating || rating === 0) {
        categories['0 Rating']++;
      } else if (rating <= 500) {
        categories['1-500']++;
      } else if (rating <= 1000) {
        categories['501-1000']++;
      } else if (rating <= 1500) {
        categories['1001-1500']++;
      } else if (rating <= 2000) {
        categories['1501-2000']++;
      } else {
        categories['2000+']++;
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
          name: 'Contest Rating',
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
          <Award className="w-5 h-5 text-purple-500" />
          Overall Rating Distribution
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No rating data available
        </p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <h3 className="card-header flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-500" />
        Overall Rating Distribution
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
