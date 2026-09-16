export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, botcheck } = req.body || {};

    // Basic honeypot spam protection
    if (botcheck) {
      return res.status(400).json({ success: false, message: 'Spam detected' });
    }

    const access_key = process.env.WEB3FORMS_ACCESS_KEY;

    if (!access_key) {
      console.error('Missing WEB3FORMS_ACCESS_KEY in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server error: WEB3FORMS_ACCESS_KEY environment variable is not configured.'
      });
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key,
        name,
        email,
        subject: subject || 'Portfolio Inquiry',
        message,
        from_name: 'Portfolio Contact Form'
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message.'
    });
  }
}
