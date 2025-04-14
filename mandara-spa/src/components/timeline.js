"use client"

export default function Timeline({ bookingsToday }) {
    const getRandomColor = () => {
        const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-gray-500"];
        return colors[Math.floor(Math.random() * colors.length)];
      };

    if (!bookingsToday || bookingsToday.length === 0) {
      return null;
    }
    else {
      return (
      
        <div className=" p-6 bg-white rounded-md w-full">
          <div className="space-y-4">
            {bookingsToday.map((booking) => (
              <div key={booking.id} className="flex items-start space-x-4">
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${
                    booking.status === "pending" ? "bg-yellow-500" : booking.status === "completed" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
    
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{booking.id}</p>
                    <span className="text-xs text-gray-500">{booking.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
  