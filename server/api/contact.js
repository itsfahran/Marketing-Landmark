/**
 * POST /api/contact
 * Handles contact form submissions
 * Validates, rate-limits (via middleware), and inserts into Supabase
 */

import { z } from 'zod';
import { getServerSupabaseClient } from '../../src/lib/supabase.js';

// Validation schema
const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  service_interested: z.string().min(1, 'Service is required').max(255),
  budget_range: z.string().max(100).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
  source_page_slug: z.string().max(255).optional(),
});

export async function handleContactSubmission(req, res) {
  try {
    // Validate input
    const validatedData = contactSchema.parse(req.body);

    // Create Supabase client
    const supabase = getServerSupabaseClient();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        ...validatedData,
        status: 'new',
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit contact form. Please try again later.',
      });
    }

    // TODO: Send email notification here (once provider is configured)
    // if (data) {
    //   await sendContactNotificationEmail(data[0]);
    // }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you shortly.',
      id: data?.[0]?.id,
    });
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.',
    });
  }
}
