import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectDB();

                // 1. Explicitly select the password since it's hidden by default in your schema
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // 2. Use the custom method you defined in your schema
                const isMatch = await user.comparePassword(credentials.password);

                if (!isMatch) {
                    throw new Error("Invalid password");
                }

                // 3. Return the user (NextAuth expects a plain object, not a Mongoose document)
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.sub;
            }

            const dbUser = await User.findOne({
                email: session.user.email
            });

            session.user.id = dbUser._id.toString();
            session.user.tryOnImages = dbUser.tryOnImages || [];
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                await connectDB();
                await User.findOneAndUpdate(
                    { email: user.email },
                    {
                        $set: {
                            name: user.name,
                            image: user.image,
                            googleId: account.providerAccountId
                        },
                        $addToSet: {
                            provider: "google"
                        }
                    },
                    {
                        upsert: true,
                        returnDocument: "after"
                    }
                );
            }
            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};