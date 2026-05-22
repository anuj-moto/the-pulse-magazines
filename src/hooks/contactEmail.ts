import type { CollectionAfterChangeHook } from 'payload'

/**
 * Emails the site owner when a new contact message arrives.
 * If no email adapter is configured (local dev), Payload logs the message
 * to the console instead — so this never blocks a submission.
 */
export const sendContactNotification: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  try {
    const settings = await req.payload.findGlobal({ slug: 'site-settings' })
    const to = settings?.contactEmail || process.env.CONTACT_NOTIFY_EMAIL
    if (!to) return doc

    await req.payload.sendEmail({
      to,
      replyTo: doc.email as string,
      subject: `New contact message — ${doc.name}`,
      text: [
        `Name:    ${doc.name}`,
        `Email:   ${doc.email}`,
        `Subject: ${doc.subject || '—'}`,
        '',
        String(doc.message),
        '',
        '— Sent from the contact form on thepulsemagazines.com',
      ].join('\n'),
    })
  } catch (err) {
    req.payload.logger.error(
      `Contact notification email failed: ${(err as Error).message}`,
    )
  }

  return doc
}
