import { and, eq, gt } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { getDb } from '../database/client'
import { userSessions, users, type UserRecord } from '../database/schema'

export const userRepository = {
  async findById(id: string): Promise<UserRecord | null> {
    const db = getDb()
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return rows[0] ?? null
  },

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    const db = getDb()
    const rows = await db.select().from(users).where(eq(users.googleSub, googleSub)).limit(1)
    return rows[0] ?? null
  },

  async createFromGoogle(googleSub: string, defaultDisplayName: string): Promise<UserRecord> {
    const db = getDb()
    const now = new Date()
    const id = randomUUID()
    const safeName = defaultDisplayName.trim().slice(0, 30) || 'Petualang'

    await db.insert(users).values({
      id,
      googleSub,
      displayName: safeName,
      avatarKey: 'R1',
      onboardingCompleted: false,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    })

    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create learner account')
    }
    return created
  },

  async completeOnboarding(
    userId: string,
    input: { displayName: string; avatarKey: string; customAvatarData?: string | null },
  ): Promise<UserRecord> {
    const db = getDb()
    const now = new Date()

    await db
      .update(users)
      .set({
        displayName: input.displayName,
        avatarKey: input.avatarKey,
        ...(input.customAvatarData !== undefined ? { customAvatarData: input.customAvatarData } : {}),
        onboardingCompleted: true,
        updatedAt: now,
      })
      .where(eq(users.id, userId))

    const updated = await this.findById(userId)
    if (!updated) {
      throw new Error('Learner account not found')
    }
    return updated
  },

  async updateProfile(
    userId: string,
    input: { displayName: string; avatarKey: string; customAvatarData?: string | null },
  ): Promise<UserRecord> {
    const db = getDb()
    const now = new Date()

    await db
      .update(users)
      .set({
        displayName: input.displayName,
        avatarKey: input.avatarKey,
        ...(input.customAvatarData !== undefined ? { customAvatarData: input.customAvatarData } : {}),
        updatedAt: now,
      })
      .where(eq(users.id, userId))

    const updated = await this.findById(userId)
    if (!updated) {
      throw new Error('Learner account not found')
    }
    return updated
  },
}

export const sessionRepository = {
  async createSession(input: {
    userId: string
    tokenHash: string
    expiresAt: Date
  }): Promise<string> {
    const db = getDb()
    const id = randomUUID()
    const now = new Date()

    await db.insert(userSessions).values({
      id,
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      lastSeenAt: now,
      createdAt: now,
    })

    return id
  },

  async findValidSessionWithUser(tokenHash: string) {
    const db = getDb()
    const now = new Date()
    const rows = await db
      .select({
        session: userSessions,
        user: users,
      })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(and(eq(userSessions.tokenHash, tokenHash), gt(userSessions.expiresAt, now)))
      .limit(1)

    return rows[0] ?? null
  },

  async touchSession(sessionId: string): Promise<void> {
    const db = getDb()
    await db
      .update(userSessions)
      .set({ lastSeenAt: new Date() })
      .where(eq(userSessions.id, sessionId))
  },

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    const db = getDb()
    await db.delete(userSessions).where(eq(userSessions.tokenHash, tokenHash))
  },
}
