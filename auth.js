import NextAuth, {CredentialsSignin} from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { ZodError } from 'zod';
import { Signinschema } from '@/libs/forms/PostSchema';

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // GitHub,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user2 = null;
        // console.log("this are credentials,", credentials)
        
        const { email, password } = await Signinschema.parseAsync(credentials);
        // pass on the data to the object
        const apidata = {
          email: email,
          password: password,
        };
        // use your data to sign in then query for user data
        try {
          const response = await axios.post(
            'https://techihubjobsproject.azurewebsites.net/api/users/login',
            apidata
          )
          if (response.data && response.data.userId) {
            let userId = response.data.userId;
            user2 = (
              await axios.get(
                `https://techihubjobsproject.azurewebsites.net/api/user-profile/${userId}`
              )
            ).data.data.userProfile;
            const user = {...user2, role: response.data.role}
            return user;
          } else {
            console.error('userid not found');
          }
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return error;
          }
          console.error('Error occurred:', error);
        }
      },
    }),
  ],
  // secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.userId;
        token.role = user.role
      }
      return token;
    },
    session({ session, token }) {
      session.user.userId = token.id;
      session.user.role = token.role
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});
