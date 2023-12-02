import bcrypt from 'bcrypt';

import Hostess_users from "@/models/hostess_user";
import connectDB from '@/config/mongoose';

connectDB();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const subdomain_name = req.headers.host.split('.')[0];
            if(subdomain_name === undefined) return res.status(400).json({ error: 'Bad Request' })
    
            const { username, password, role } = req.body;
            if(!username || !password || !role) return res.status(400).json({ error: 'Bad Request' })
            
            const exists = await Hostess_users.findOne({username: username}).lean().exec()
            if(exists) return res.status(400).json({ error: 'Bad Request' })
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await Hostess_users.create({
                subdomain_name,
                username,
                password: hashedPassword,
                role,
                unix_timestamp: Date.now(),
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