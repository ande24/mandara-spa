"use client"

export default function Timeline({ schedule, bookings }) {
  console.log("timeline Schedule:", schedule);
  if (!schedule || schedule.length === 0) {
    return <div className="p-6  rounded-md w-full text-center text-gray-500">No bookings for today</div>;
  }

  // Use the original schedule's slot bookings (do not plot from bookings prop)
  const slotMap = schedule;

  // Find the maximum number of bookings in any slot to determine columns
  const maxBookings = Math.max(...slotMap.map(slot => (slot.bookings ? slot.bookings.length : 0)), 1);

  // Build a flat list of all unique booking+guest pairs for columns
  const bookingGuestPairs = [];
  slotMap.forEach(slot => {
    (slot.bookings || []).forEach(b => {
      const key = `${b.booking}|${b.guest || ''}`;
      if (!bookingGuestPairs.some(pair => pair.key === key)) {
        bookingGuestPairs.push({ key, booking: b.booking, guest: b.guest });
      }
    });
  });

  // Helper to track merged cells
  const mergeMap = Array.from({ length: bookingGuestPairs.length }, () => Array(slotMap.length).fill(false));
  const rowSpans = Array.from({ length: bookingGuestPairs.length }, () => Array(slotMap.length).fill(1));

  // Precompute rowSpans and mergeMap for each booking+guest column
  for (let colIdx = 0; colIdx < bookingGuestPairs.length; colIdx++) {
    let prevService = null;
    let prevIdx = null;
    for (let sIdx = 0; sIdx <= slotMap.length; sIdx++) {
      const slot = slotMap[sIdx];
      const booking = slot && slot.bookings && (slot.bookings.find(b => `${b.booking}|${b.guest || ''}` === bookingGuestPairs[colIdx].key));
      const serviceKey = booking ? `${booking.service}` : null;
      if (serviceKey && serviceKey === prevService && serviceKey !== null) {
        rowSpans[colIdx][prevIdx]++;
        mergeMap[colIdx][sIdx] = true;
      } else {
        prevIdx = sIdx;
        rowSpans[colIdx][sIdx] = 1;
      }
      prevService = serviceKey;
    }
  }

  return (
    <div className="p-6 rounded-md w-full overflow-x-auto">
      <table className="min-w-full text-xs border">
        <thead>
          <tr className="bg-yellow-100">
            <th className="border px-2 py-1 text-center font-serif">Time</th>
            {bookingGuestPairs.map((pair, i) => (
              <th key={i} className="border px-2 py-1 text-center">
                <div>{pair.booking} ({pair.guest})</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slotMap.map((slot, idx) => (
            <tr key={idx} className={slot.bookings && slot.bookings.length > 0 ? "bg-yellow-50" : idx % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="border px-2 py-1 bg-yellow-100 font-serif text-center whitespace-nowrap">{slot.start} - {slot.end}</td>
              {bookingGuestPairs.map((pair, colIdx) => {
                if (mergeMap[colIdx][idx]) return null;
                const booking = (slot.bookings || []).find(b => `${b.booking}|${b.guest || ''}` === pair.key);
                const rowspan = rowSpans[colIdx][idx];
                return (
                  <td
                    key={colIdx}
                    className={`border px-2 py-1 align-middle${booking ? '' : ' bg-gray-200'}`}
                    rowSpan={rowspan > 1 ? rowspan : undefined}
                  >
                    {booking ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold text-[#301414]">{booking.service}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400"></span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
