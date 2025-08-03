import NextAuth, { DefaultSession, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "."
import crypto from "crypto";

// Type extensions
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    phone: string
    grade: string
  }
  
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      phone: string
      grade: string
    } & DefaultSession["user"]
  }
}

// Password hashing with PBKDF2 (Edge compatible)
const hashPassword = (password: string, salt: string): string => {
  return crypto.pbkdf2Sync(
    password, 
    salt, 
    100000, 
    64, 
    'sha512'
  ).toString('hex');
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "user@example.com",
          required: true 
        },
        password: { 
          label: "Password", 
          type: "password", 
          required: true 
        },
        name: { 
          label: "Name (Register Only)", 
          type: "text" 
        },
        phone: { 
          label: "Phone (Register Only)", 
          type: "tel" 
        },
        grade: { 
          label: "Grade (Register Only)", 
          type: "text" 
        },
       
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          const { email, password, name, phone, grade } = credentials
          
          // Find existing user
          const user = await prisma.user.findUnique({
            where: { email: email as string }
          })

          if (user) {
            // Verify password using PBKDF2
            const [salt, storedHash] = user.password.split(':');
            const hash = hashPassword(password as string, salt);
            
            if (hash !== storedHash) {
              throw new Error("Invalid password")
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name || "",
              phone: user.phone,
              role: user.role,
              grade: user.grade
            } as User
          }

          // Registration flow
          if (!name || !phone) {
            throw new Error("Name and phone are required for registration")
          }

          // Generate salt and hash
          const salt = crypto.randomBytes(16).toString('hex');
          const hash = hashPassword(password as string, salt);
          const hashedPassword = `${salt}:${hash}`;
          
          const newUser = await prisma.user.create({
            data: {
              email: email as string,
              password: hashedPassword,
              name: name as string,
              phone: phone as string,
              role: "USER",
              grade: grade as string
            }
          })

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            phone: newUser.phone,
            role: newUser.role,
            grade: newUser.grade
          } as User

        } catch (error) {
          console.error("Authentication error:", error)
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.phone = user.phone
        token.grade = user.grade
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.phone = token.phone as string
        session.user.grade = token.grade as string
        }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
})