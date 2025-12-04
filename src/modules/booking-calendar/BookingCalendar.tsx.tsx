import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Scissors, MoreVertical } from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  staffName: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

const BookingCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Sample data
  useEffect(() => {
    const sampleBookings: Booking[] = [
      {
        id: '1',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@email.com',
        service: 'Haircut & Style',
        staffName: 'Emma Wilson',
        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
        endTime: new Date(new Date().setHours(11, 0, 0, 0)),
        status: 'confirmed'
      },
      {
        id: '2',
        customerName: 'Michael Chen',
        customerEmail: 'michael@email.com',
        service: 'Manicure',
        staffName: 'Lisa Rodriguez',
        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
        endTime: new Date(new Date().setHours(15, 0, 0, 0)),
        status: 'pending'
      },
      {
        id: '3',
        customerName: 'Jessica Williams',
        customerEmail: 'jessica@email.com',
        service: 'Facial Treatment',
        staffName: 'Sophia Martinez',
        startTime: new Date(new Date().setHours(16, 0, 0, 0)),
        endTime: new Date(new Date().setHours(17, 30, 0, 0)),
        status: 'confirmed'
      }
    ];
    setBookings(sampleBookings);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(booking.startTime, date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
          <p className="text-gray-600">Manage appointments and schedules</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: new Date(monthStart).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32"></div>
          ))}
          
          {monthDays.map(day => {
            const dayBookings = getBookingsForDate(day);
            return (
              <div
                key={day.toString()}
                className={`min-h-32 border rounded-lg p-2 cursor-pointer transition ${
                  isToday(day)
                    ? 'bg-pink-50 border-pink-200'
                    : selectedDate && isSameDay(day, selectedDate)
                    ? 'bg-blue-50 border-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${
                    isToday(day) ? 'text-pink-600' : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {dayBookings.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {dayBookings.slice(0, 2).map(booking => (
                    <div
                      key={booking.id}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(booking.status)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(booking);
                      }}
                    >
                      <div className="font-medium truncate">{booking.service}</div>
                      <div className="truncate">{format(booking.startTime, 'HH:mm')}</div>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day View */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Appointments for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Cancelled</span>
              </div>
            </div>
          </div>

          {getBookingsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">📅</div>
              <p className="text-gray-500">No appointments scheduled</p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
              >
                + Schedule an appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {getBookingsForDate(selectedDate).map(booking => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      booking.status === 'confirmed' ? 'bg-green-100' :
                      booking.status === 'pending' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{booking.service}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {booking.customerName}
                        </span>
                        <span className="flex items-center">
                          <Scissors className="h-4 w-4 mr-1" />
                          {booking.staffName}
                        </span>
                        <span>
                          {format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <p className="text-gray-900">{selectedBooking.service}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <p className="text-gray-900">{selectedBooking.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.customerEmail}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff
                  </label>
                  <p className="text-gray-900">{selectedBooking.staffName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <p className="text-gray-900">
                    {format(selectedBooking.startTime, 'MMM d, yyyy HH:mm')} - 
                    {format(selectedBooking.endTime, 'HH:mm')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <p className="text-gray-900">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;