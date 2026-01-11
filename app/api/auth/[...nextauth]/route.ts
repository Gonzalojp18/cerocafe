import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodbClient"
import bcrypt from "bcryptjs"

console.log('🚀 Cargas de ruta: /api/auth/[...nextauth]')

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const client = await clientPromise
                    const db = client.db('cerocafe')
                    const usersCollection = db.collection('users')

                    const user = await usersCollection.findOne({
                        email: credentials.email
                    })

                    if (!user) {
                        return null
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        return null
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        role: user.role || 'customer',
                        points: user.points || 0
                    }
                } catch (error) {
                    console.error('Error en authorize:', error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.points = user.points
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.points = token.points as number
            }
            return session
        }
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }