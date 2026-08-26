// src/lib/auth.ts
import { currentUser } from "@clerk/nextjs/server";

/**
 * Validates that the current request is executed by the whitelisted admin.
 * Throws an error or returns false if unauthorized.
 */
export async function requireAdmin() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  )?.emailAddress;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    !primaryEmail ||
    primaryEmail.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    throw new Error("Forbidden: You do not have admin permissions.");
  }

  return user;
}
