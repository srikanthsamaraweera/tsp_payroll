import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 15 * 60 * 1000; // 15 minutes

const getLimiterState = (key) => {
    const entry = loginAttempts.get(key) || { attempts: [], blockedUntil: 0 };
    const now = Date.now();
    const recent = entry.attempts.filter((t) => now - t < WINDOW_MS);
    const blockedUntil = entry.blockedUntil > now ? entry.blockedUntil : 0;
    return { attempts: recent, blockedUntil };
};

const recordFailure = (key) => {
    const now = Date.now();
    const state = getLimiterState(key);
    state.attempts.push(now);
    let blockedUntil = state.blockedUntil;
    if (state.attempts.length >= MAX_ATTEMPTS) {
        blockedUntil = now + BLOCK_MS;
    }
    loginAttempts.set(key, { attempts: state.attempts, blockedUntil });
};

const clearFailures = (key) => {
    loginAttempts.delete(key);
};

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                const emailKey = credentials?.email?.toLowerCase() || "unknown";
                const limiter = getLimiterState(emailKey);
                const now = Date.now();
                if (limiter.blockedUntil && limiter.blockedUntil > now) {
                    return null;
                }

                if (!credentials?.email || !credentials?.password) {
                    recordFailure(emailKey);
                    return null;
                }
                // Find the user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                // Verify if user exists, is enabled, and password matches
                if (user && user.enabled === 1) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordValid) {
                        clearFailures(emailKey);
                        return { id: user.id, email: user.email, account_type: user.account_type };
                    }
                }
                recordFailure(emailKey);
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
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt", // Use JWT-based session management
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
