import Booking from '@/models/booking';
import Subdomains from '@/models/subdomains';
import io from 'socket.io-client'

// API route to get all users
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
        // Get the client's IP address from the request object
        const ip = req.connection.remoteAddress;
        
        const subdomain_name = req.headers.host.split('.')[0];
        if(subdomain_name === undefined) return res.status(400).json({ error: 'Bad Request' })
        
        const exists = await Subdomains.findOne({subdomain_name: subdomain_name})
        if(!exists) return res.status(400).json({ error: 'Bad Request' })

        const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=')
            acc[key.trim()] = value
            return acc
          }, {}) || {}
        const uid = cookies.uid_token;
        const user_agent = req.headers['user-agent'];
        const unix_timestamp = Date.now();
        


        /* get info from json body */
        let {
            reserved_time, full_name, phone_number=null,
            email_address=null, guests, birthday=null,
            reserved_table
        } = req.body;


        const new_book = {
          subdomain_name,
          unix_timestamp,
          user_agent,
          uid,
          ip,
          reserved_time,
          full_name,
          phone_number,
          email_address,
          guests,
          birthday,
          description: '',
          status: 'reserved',
          reserved_table
        }

        const booking = await Booking.create(new_book);

        // const socket = io(process.env.Web_Socket_Server)
        // socket.timeout(5000).emit('new_booking', new_book, (err, response) => {
        //   if (err) {
        //     // the server did not acknowledge the event in the given delay
        //   } else {
        //     console.log(response.status); // 'ok'
        //   }
        // });

        res.status(200).json({ status: 'ok', booking });
    } catch (error) {
      console.error('Error handeling Request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}