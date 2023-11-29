import subdomain_views from "@/models/subdomain_views";
import connectDB from '@/config/mongoose';
import Subdomains from '@/models/subdomains';

connectDB();

export async function onWebView({req, query}) {
  // Get the client's IP address from the request object
  const ipAddress = req.connection.remoteAddress;

  // Get the the current url
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[key.trim()] = value
    return acc
  }, {}) || {}
  const subdomain_name = req.headers.host.split('.')[0];
  const uid = cookies?.uid_token;

  if(uid === undefined) return;

  const user_agent = req.headers['user-agent'];
  const unix_timestamp = Date.now();
  
  let card_id = query?.card_id || null;

  const exists = await Subdomains.findOne({subdomain_name: subdomain_name})
  const cards = exists?.cards || [];
  if(!cards.includes(card_id) && card_id) 
    card_id=null;
  
  await subdomain_views.create({
    subdomain_name,
    uid,
    user_agent,
    unix_timestamp,
    card_id,
    ip: ipAddress,
    URL: fullUrl
  });
}