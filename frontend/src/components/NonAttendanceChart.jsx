import ReactECharts from 'echarts-for-react';
import { UserX } from 'lucide-react';
import { useMemo } from 'react';

export default function NonAttendanceChart({ data, contestNames, selectedContest, isDark }) {
  const option = useMemo(() => {
    if (!data || data.length === 0 || !contestNames || contestNames.length === 0) return null;

    // Get the contests to display
    const displayContests = selectedContest && selectedContest !== 'all' 
      ? [selectedContest] 
      : contestNames;

    const chartData = displayContests.map(contest => {
      const notAttended = data.filter(student => {
        const score = student.contests[contest];
        return !score || score === 0;
      }).length;

      const attended = data.length - notAttended;
      const attendanceRate = data.length > 0 ? ((attended / data.length) * 100).toFixed(1) : 0;

      return {
        contest: contest.length > 20 ? contest.substring(0, 20) + '...' : contest,
        notAttended,
        attended,
        attendanceRate: parseFloat(attendanceRate)
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: { color: isDark ? '#f3f4f6' : '#111827' },
        formatter: (params) => {
          const dataIndex = params[0].dataIndex;
          const item = chartData[dataIndex];
          return `${params[0].axisValue}<br/>
            Attended: ${item.attended}<br/>
            Not Attended: ${item.notAttended}<br/>
            Attendance Rate: ${item.attendanceRate}%`;
        }
      },
      legend: {
        data: ['Not Attended', 'Attendance Rate (%)'],
        bottom: '3%',
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.map(d => d.contest),
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: displayContests.length > 3 ? 30 : 0,
          fontSize: 11
        },
        axisLine: {
          lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Students',
          nameTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
          axisLabel: { color: isDark ? '#9ca3af' : '#6b7280' },
          splitLine: {
            lineStyle: { color: isDark ? '#374151' : '#e5e7eb' }
          }
        },
        {
          type: 'value',
          name: 'Attendance %',
          nameTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
          max: 100,
          axisLabel: {
            color: isDark ? '#9ca3af' : '#6b7280',
            formatter: '{value}%'
          },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Not Attended',
          type: 'bar',
          data: chartData.map(d => d.notAttended),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ef4444' },
                { offset: 1, color: '#dc2626' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 11
          }
        },
        {
          name: 'Attendance Rate (%)',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.map(d => d.attendanceRate),
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#10b981'
          },
          itemStyle: {
            color: '#10b981'
          },
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 11
          }
        }
      ]
    };
  }, [data, contestNames, selectedContest, isDark]);

  if (!option) {
    return (
      <div className="card">
        <h3 className="card-header flex items-center gap-2">
          <UserX className="w-5 h-5 text-red-500" />
          Contest Attendance
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
        <UserX className="w-5 h-5 text-red-500" />
        Contest Attendance & Participation
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '400px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
