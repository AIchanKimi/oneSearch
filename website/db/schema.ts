import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const actionProviders = sqliteTable('ActionProviders', {
  providerId: int('ProviderId').primaryKey({ autoIncrement: true }),
  label: text('Label').notNull(),
  homepage: text('Homepage').notNull(),
  icon: text('Icon').notNull(),
  tag: text('Tag').notNull(),
  link: text('Link').notNull(),
  obsoleteCount: int('ObsoleteCount').default(0),
  usageCount: int('UsageCount').default(0),
})

export const initialProviders = sqliteTable('InitialProviders', {
  providerId: int('ProviderId').primaryKey().references(() => actionProviders.providerId, { onDelete: 'cascade' }),
  enabled: int('Enabled').notNull().default(1),
})
