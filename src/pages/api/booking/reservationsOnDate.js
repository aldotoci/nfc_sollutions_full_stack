import Booking from '@/models/booking';
import Subdomains from '@/models/subdomains';
import dayjs from 'dayjs'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

// API route to get all users
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const subdomain_name = req.headers.host.split('.')[0];

        const session = await getServerSession(req, res, authOptions)
        if (session) {
          // Signed in
          if (session.role !== 'hostess' || session.subdomain_name !== subdomain_name) 
            return res.status(401).end()
        } else {
          // Not Signed in
          res.status(401).end()
        }
        if(subdomain_name === undefined) return res.status(400).json({ error: 'Bad Request' })

        /* get info from json body */
        let {
          startSelectedDate,
          endSelectedDate
        } = req.query;

        const targetStartDate = dayjs(startSelectedDate); // Replace with your target date
        const targetEndDate = dayjs(endSelectedDate); // Replace with your target date

        // Set the start and end of the target date
        const startOfDay = targetStartDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        const endOfDay = targetEndDate.format('YYYY-MM-DDTHH:mm:ss')

        const bookings = await Booking.find({
            subdomain_name, 
            status: 'reserved',
            reserved_time: {
                $gte: new Date(startOfDay),
                $lt: new Date(endOfDay),
            }
        });

        // const socket = io(process.env.Web_Socket_Server)
        // socket.timeout(5000).emit('new_booking', book, (err, response) => {
        //   if (err) {
        //     // the server did not acknowledge the event in the given delay
        //   } else {
        //     console.log(response.status); // 'ok'
        //   }
        // });

        res.status(200).json({ bookings });
    } catch (error) {
      console.error('Error handeling Request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}