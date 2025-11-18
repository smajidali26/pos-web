import React from 'react';
import { Badge } from 'react-bootstrap';
import { Shift, ShiftStatus } from '../../services/shiftService';

interface ShiftCalendarProps {
  shifts: Shift[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const ShiftCalendar: React.FC<ShiftCalendarProps> = ({ shifts, selectedDate, onDateChange }) => {
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.scheduledStartTime);
      return shiftDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.Scheduled:
        return 'primary';
      case ShiftStatus.InProgress:
        return 'success';
      case ShiftStatus.Completed:
        return 'info';
      case ShiftStatus.Cancelled:
        return 'danger';
      case ShiftStatus.NoShow:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar">
      <div className="calendar-header d-flex">
        {weekDays.map((day, index) => (
          <div key={index} className="calendar-day-header text-center font-weight-bold p-2" style={{ flex: 1 }}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-body">
        <div className="d-flex flex-wrap">
          {days.map((day, index) => (
            <div
              key={index}
              className="calendar-day border p-2"
              style={{
                width: `${100 / 7}%`,
                minHeight: '120px',
                cursor: day ? 'pointer' : 'default',
                backgroundColor: day && day.toDateString() === new Date().toDateString() ? '#f0f8ff' : 'transparent'
              }}
              onClick={() => day && onDateChange(day)}
            >
              {day && (
                <>
                  <div className="font-weight-bold mb-2">{day.getDate()}</div>
                  {getShiftsForDate(day).map((shift, idx) => (
                    <Badge
                      key={idx}
                      variant={getStatusColor(shift.status)}
                      className="d-block mb-1 text-truncate"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {shift.employeeProfile?.user?.firstName} {shift.employeeProfile?.user?.lastName}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
