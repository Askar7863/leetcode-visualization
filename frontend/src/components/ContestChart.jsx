import ReactECharts from 'echarts-for-react';
import { BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

export default function ContestChart({ data, contestNames, selectedContest, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length === 0) return null;

    // Show score distribution ranges instead of individual students
    const scoreRanges = [
      { label: '0-500', min: 0, max: 500 },
      { label: '501-1000', min: 501, max: 1000 },
      { label: '1001-1500', min: 1001, max: 1500 },
      { label: '1501-2000', min: 1501, max: 2000 },
      { label: '2000+', min: 2001, max: Infinity }
    ];

    let chartData;
    if (selectedContest && selectedContest !== 'all') {
      // For specific contest, show score distribution
      chartData = scoreRanges.map(range => {
        const count = data.filter(s => {
          const score = s.contests[selectedContest] || 0;
          return score > 0 && score >= range.min && score <= range.max;
        }).length;
        return { range: range.label, count };
      });
    } else {
      // For all contests, show average participation per contest
      chartData = contestNames.map(contest => {
        const participants = data.filter(s => s.contests[contest] > 0).length;
        return { range: contest.length > 15 ? contest.substring(0, 15) + '...' : contest, count: participants };
      });
    }

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: { color: isDark ? '#f3f4f6' : '#111827' },
        formatter: (params) => {
          const item = params[0];
          return `${item.axisValue}<br/>${selectedContest && selectedContest !== 'all' ? 'Students' : 'Participants'}: ${item.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.map(d => d.range),
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: 30
        },
        axisLine: {
          lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      },
      yAxis: {
        type: 'value',
        name: selectedContest && selectedContest !== 'all' ? 'Number of Students' : 'Participants',
        nameTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
        axisLabel: { color: isDark ? '#9ca3af' : '#6b7280' },
        splitLine: {
          lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      },
      series: [
        {
          name: 'Count',
          type: 'bar',
          data: chartData.map(d => d.count),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
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
            color: isDark ? '#f3f4f6' : '#111827'
          }
        }
      ]
    };
  }, [data, contestNames, selectedContest, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Contest Performance
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
        <BarChart3 className="w-5 h-5 text-blue-500" />
        {selectedContest && selectedContest !== 'all' ? `Score Distribution - ${selectedContest}` : 'Contest Participation Overview'}
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
