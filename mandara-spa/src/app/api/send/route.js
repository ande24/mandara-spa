import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req, res) {
    const requestBody = await req.text();
    const { date, pax, location, services, name, id, mobile, landline, notes, total } = JSON.parse(requestBody);

  try {
    const { data, error } = await resend.emails.send({
      from: 'The Mandara Spa <themandaraspa@resend.dev>',
      to: ['andeellenes@gmail.com'],
      subject: 'The Mandara Spa Booking Request Confirmation',
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Request Confirmation</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                }
                .email-container {
                width: 100%;
                background-color: #ffffff;
                margin: 20px auto;
                padding: 20px;
                max-width: 600px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                color: #333333;
                font-size: 24px;
                text-align: center;
                margin-bottom: 20px;
                }
                .email-content {
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
                }
                .email-content p {
                margin: 10px 0;
                }
                .email-content strong {
                color: #333333;
                }
                .email-footer {
                text-align: center;
                font-size: 14px;
                color: #999999;
                margin-top: 30px;
                border-top: 1px solid #ddd;
                padding-top: 15px;
                }
                .email-footer a {
                color: #007bff;
                text-decoration: none;
                }
            </style>
            </head>
            <body>

            <div class="email-container">
                <h1>Booking Confirmation</h1>
                <div class="email-content">
                <p>Dear ${name ? name : "customer"},</p>
                <p>We have received your booking request for <strong>${pax}</strong> with the following details:</p>
                <p><strong>Booking ID:</strong> ${id}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Services:</strong></p>
                <ul>
                ${services.map((guest, guestIdx) => `
                  <div style="margin-top: 20px;">
                    <p style="font-weight: bold; margin-bottom: 10px;">Guest ${guest.guest}</p>
                    <ul style="list-style: none; padding: 0;">
                      ${guest.services.map((service, svcIdx) => `
                        <li key="${svcIdx}" style="padding-bottom: 5px; margin-bottom: 5px; border-bottom: 1px solid #ddd;">
                          <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>
                              ${service.name}
                              ${service.duration ? `<span style="margin-left: 10px; color: #888;">(${
                                service.timeSlot && (() => {
                                      const [start, end] = service.timeSlot.split("-");
                                      const format12hr = (t) => {
                                          const d = new Date(`1970-01-01T${t}:00`);
                                          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                      };
                                      return `${format12hr(start)} - ${format12hr(end)}`;
                                  })()
                                })  </span>` : ''}
                            </span>
                            <span style="margin-left: 16px;">₱${service.price}</span>
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                `).join('')}
                </ul>
                <p><strong>Total Price: </strong> ₱${total}</p>
                <p><strong>Additional Notes:</strong> ${notes}</p>
                <br/>
                <p>In the event of scheduling conflicts, we will reach out to discuss alternative arrangements.<p>
                <p>For cancellations and other concerns, feel free to contact us at <strong>${landline ? landline : "8869 9910"}</strong> or <strong>${mobile ? mobile : "+63 915 844 3003"}</strong>.</p>
                <p>See you there!</p>
                </div>
                <div class="email-footer">
                <p>The Mandara Spa | Powered by Apexel Development</p>
                </div>
            </div>

            </body>
            </html>`
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}