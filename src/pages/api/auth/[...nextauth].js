import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Hostess_user from "@/models/hostess_user";
import Booking_user from "@/models/booking_user";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (
            credentials.username === undefined ||
            credentials.password === undefined
          )
            return null;

          const subdomain_name = req.headers.host.split(".")[0];

          // Add logic here to look up the user from the credentials supplied
          const user = await Hostess_user.findOne({
            username: credentials.username,
          })
            .lean()
            .exec();
          if (!user) return null;

          const match = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!match) return null;

          if (subdomain_name !== user.subdomain_name) return null;

          delete user.password;
          return user;
        } catch (error) {
          console.log(error);
        }
      },
    }),
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
		})

    // ...add more providers here
  ],
  callbacks: {
    async jwt({ session,account, token, user }) {
      // console.log('session123123', session,account, token, user)
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account?.access_token;
        token.provider = account?.provider;
        token.role = user?.role;
        token.subdomain_name = user?.subdomain_name;
      }
      return token;
    },
    async session({ session,token }) {    
      console.log('tokenasdasdasdasd', token);
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.role = token?.role || 'user';
      session.subdomain_name = token?.subdomain_name;
      session.provider = token?.provider;
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   // if (url.startsWith("/")) return `${baseUrl}${url}`
    //   // // Allows callback URLs on the same origin
    //   // else if (new URL(url).origin === baseUrl) return url
    //   return "http://ulliri.dev.al:3000/booking/hostess_dashboard";
    // },
    async signIn({ account, profile}) {
      if(account?.provider != 'google') return true;
      if(!profile){
        throw new Error("No profile");
      }
      let user_db = await Booking_user.findOne({email: profile.email})
      if(!user_db){
        user_db = await Booking_user.create({
          email: profile.email,
          name: profile.name,
          unix_timestamp: Date.now(),
        });
      }
      if(user_db?.name !== profile.name){
        user_db.name = profile.name;
        await user_db.save();
      }
      return true;
    }
  },
};
export default NextAuth(authOptions);
