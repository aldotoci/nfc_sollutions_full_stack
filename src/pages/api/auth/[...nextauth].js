import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import Hostess_user from "@/models/hostess_user"
import bcrypt from 'bcrypt';

export const authOptions = {
	secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
      CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
			try {
				if(credentials.username === undefined || credentials.password === undefined) return null;

				const subdomain_name = req.headers.host.split('.')[0];

				console.log(credentials)
				// Add logic here to look up the user from the credentials supplied
				const user = await Hostess_user.findOne({username: credentials.username}).lean().exec()
				if(!user) return null;

				const match = await bcrypt.compare(credentials.password, user.password);
				if(!match) return null;

				if(subdomain_name !== user.subdomain_name) return null;

				delete user.password;
				return user;
			} catch (error) {
				console.log(error)
			}
    },
  })
    // ...add more providers here
  ],
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.access_token
			}
			return token
		},
		async session({ session, token, user }) {
			// Send properties to the client, like an access_token from a provider.
			session.accessToken = token.accessToken
			return session
		},
		async redirect({ url, baseUrl}) {

			// Allows relative callback URLs
			// if (url.startsWith("/")) return `${baseUrl}${url}`
			// // Allows callback URLs on the same origin
			// else if (new URL(url).origin === baseUrl) return url
			return 'http://ulliri.dev.al:3000/booking/hostess_dashboard'
		}
	},
}
export default NextAuth(authOptions)