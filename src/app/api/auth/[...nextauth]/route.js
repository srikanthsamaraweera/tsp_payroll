import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                // Find the user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                // Verify if user exists, is enabled, and password matches
                if (user && user.enabled === 1) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordValid) {
                        return { id: user.id, email: user.email, account_type: user.account_type };
                    }
                }
                // Return null if login fails
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user = { email: token.email, account_type: token.account_type };
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.account_type = user.account_type;
            }
            return token;
        }
    },
    pages: {
        signIn: "/login" // Custom login page route
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
