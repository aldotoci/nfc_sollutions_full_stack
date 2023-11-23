import connectDB from '../../config/mongoose';
import Subdomains from '../../models/subdomains';

// Connect to MongoDB
connectDB();

// API route to get all users
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      /* create a variable equaled to the get parameter 'subdomain' */
      const subdomain_name = req.query?.subdomain;
      if(subdomain_name === undefined) return res.status(400).json({ error: 'Bad Request' })

			const exists = await Subdomains.findOne({subdomain_name: subdomain_name})

      res.status(200).json({ exists: !!exists, links: exists?.links, storeName: exists?.storeName || {} });
    } catch (error) {
      console.error('Error handeling Request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}