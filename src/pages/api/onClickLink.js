import connectDB from '../../config/mongoose';
import Link_clicked from '../../models/links_clicked';
import Subdomains from '@/models/subdomains';

// Connect to MongoDB
connectDB();

// API route to get all users
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
        /* get card_id from json body */
        let { card_id, link_type, link_clicked } = req.body;

        
        const subdomain_name = req.headers.host.split('.')[0];
        if(subdomain_name === undefined) return res.status(400).json({ error: 'Bad Request' })
        
        const exists = await Subdomains.findOne({subdomain_name: subdomain_name})
        if(!exists) return res.status(400).json({ error: 'Bad Request' })
        
        const cards = exists?.cards || [];
        if(!cards.includes(card_id) && card_id) 
            card_id=null;

        const links = exists?.links || {};
        if(!links[link_type] || !!!link_type) return res.status(400).json({ error: 'Bad Request' })
        if(link_clicked !== links[link_type]) return res.status(400).json({ error: 'Bad Request' })


        const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=')
            acc[key.trim()] = value
            return acc
          }, {}) || {}
        const uid = cookies?.uid_token;
        const user_agent = req.headers['user-agent'];
        const unix_timestamp = Date.now();
        


        await Link_clicked.create({
            subdomain_name,
            uid,
            user_agent,
            unix_timestamp,
            card_id,
            link_type,
            link_clicked
        });
        res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error handeling Request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}