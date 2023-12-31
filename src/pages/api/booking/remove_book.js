import Booking from '@/models/booking';
import Subdomains from '@/models/subdomains';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

// API route to get all users
export default async function handler(req, res) {
  if (req.method === 'POST') {
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
            book_id,
            reserved_table,
        } = req.body;

        const book = await Booking.findById(book_id);

        if(!book) return res.status(400).json({ error: 'Bad Request' })

        if(subdomain_name !== book.subdomain_name) return res.status(400).json({ error: 'Bad Request' })

        book.status = 'closed';

        await book.save();

        res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error handeling Request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}