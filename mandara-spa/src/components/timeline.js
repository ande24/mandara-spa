export default function Timeline() {
    const events = [
      {
        time: "15:00 PM",
        title: "All Hands Meeting",
        type: "info",
        users: [],
      },
      {
        time: "15:00 PM",
        title: "Build the production release",
        type: "new",
        users: [
          "/avatars/user1.png",
          "/avatars/user2.png",
          "/avatars/user3.png",
          "/avatars/user4.png",
        ],
      },
      {
        time: "14:30 PM",
        title: "Something not important",
        type: "default",
        users: [],
      },
      {
        time: "14:00 PM",
        title: "This dot has an info state",
        type: "info",
        users: [],
      },
      {
        time: "13:30 PM",
        title: "This dot has a dark state",
        type: "dark",
        users: [],
      },
    ];
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Timeline Example</h2>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div
                className={`w-3 h-3 rounded-full mt-1 ${
                  event.type === "new"
                    ? "bg-red-500"
                    : event.type === "info"
                    ? "bg-blue-500"
                    : event.type === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              ></div>
  
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.title}</p>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
  
                {event.users.length > 0 && (
                  <div className="flex mt-2">
                    {event.users.map((user, i) => (
                      <img
                        key={i}
                        src={user}
                        alt="User Avatar"
                        className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  