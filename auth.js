import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { ZodError } from 'zod';
import { Signinschema } from '@/libs/forms/PostSchema';

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}

const providers = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = await Signinschema.parseAsync(credentials);
        const apidata = { email, password };
        
        const response = await axios.post(
          'https://techihubjobsproject.azurewebsites.net/api/users/login',
          apidata
        );
        
        if (response.data && response.data.userId) {
          let userId = response.data.userId;
          const userProfileResponse = await axios.get(
            `https://techihubjobsproject.azurewebsites.net/api/user-profile/${userId}`
          );
          const user = {...userProfileResponse.data.data.userProfile, role: response.data.role};
          return user;
        } else {
          throw new InvalidLoginError();
        }
      } catch (error) {
        if (error instanceof ZodError) {
          throw new InvalidLoginError();
        }
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            throw new InvalidLoginError();
          }
          throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
        }
        throw error;
      }
    }
  }),
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  debug: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.userId;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.userId = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});