import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { Signinschema } from '@/libs/forms/PostSchema';
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const { email, password } = await Signinschema.parseAsync(credentials);

        const apidata = {
          email: email,
          password: password,
        };
        // logic to verify if user exists
        try {
          const response = await axios.post(
            'https://techihubjobsproject.azurewebsites.net/api/users/login',
            apidata
          );
          if (response.data && response.data.userId) {
            let userId = response.data.userId;
            user = (
              await axios.get(
                `https://techihubjobsproject.azurewebsites.net/api/user-profile/${userId}`
              )
            ).data.data.userProfile;
            console.log(user);
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
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.userId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.userId = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});
