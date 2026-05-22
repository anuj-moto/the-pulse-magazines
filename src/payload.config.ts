import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Magazines } from './collections/Magazines'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'
import { Testimonials } from './collections/Testimonials'
import { Pages } from './collections/Pages'
import { Subscribers } from './collections/Subscribers'
import { ContactSubmissions } from './collections/ContactSubmissions'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpPort = Number(process.env.SMTP_PORT) || 465

/**
 * Email adapter — only wired when SMTP credentials are present.
 * Without them Payload logs emails to the console (fine for local dev).
 */
const emailAdapter = process.env.SMTP_USER
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_USER,
      defaultFromName: 'The Pulse Magazines',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· The Pulse CMS',
    },
  },
  collections: [
    // Content
    Articles,
    Magazines,
    Media,
    Testimonials,
    Pages,
    // Site Structure
    Categories,
    Tags,
    Authors,
    // Inbox
    Subscribers,
    ContactSubmissions,
    // Settings
    Users,
  ],
  globals: [SiteSettings, Navigation, Homepage],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
  }),
  email: emailAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./pulse.db',
    },
    // Use committed migration files rather than dev auto-push, so local and
    // production schemas are deterministic and identical.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [],
})
