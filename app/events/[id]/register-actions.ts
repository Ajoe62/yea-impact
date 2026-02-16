// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/client";

/**
 * Server action to register the authenticated user for an event.  Generates
 * a unique token and inserts a row into `event_registrations`.  Returns a
 * signed URL for the QR code image stored in Supabase Storage.  Requires
 * that the Storage bucket `qr-codes` exists and that `qrcode` library is
 * available to generate a QR image.
 */
export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const serverClient = await createServer();
  // Check user auth
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return { error: "Please sign in to register." };
  }
  // Generate unique token using crypto
  const token = crypto.randomUUID();
  // Insert registration row. Unique constraint on (user_id, event_id) prevents duplicates.
  const { error } = await serverClient.from("event_registrations").insert({
    event_id: eventId,
    user_id: user.id,
    token,
    checked_in: false,
  });
  if (error) {
    if ((error as any).code === "23505") {
      return { error: "You have already registered for this event." };
    }
    return { error: error.message };
  }
  // Generate QR code on the server and upload to storage
  try {
    // Dynamically import qrcode library to avoid bundling it in the client bundle.
    const QRCode = await import("qrcode");
    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}/checkin?token=${token}`
    );
    // Upload to Supabase Storage
    const storageClient = serverClient.storage.from("qr-codes");
    const buffer = Buffer.from(qrDataUrl.split(",")[1], "base64");
    const fileName = `${token}.png`;
    await storageClient.upload(fileName, buffer, {
      contentType: "image/png",
      upsert: true,
    });
    // Get a public URL to the QR code
    const { data: qrPublicUrl } = storageClient.getPublicUrl(fileName);
    return { success: true, qrUrl: qrPublicUrl?.publicUrl };
  } catch (err: any) {
    // If QR generation fails, just return success without an image
    return { success: true };
  }
}
