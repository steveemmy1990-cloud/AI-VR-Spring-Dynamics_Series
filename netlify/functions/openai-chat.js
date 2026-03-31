/**
 * Netlify serverless function: proxy to OpenAI Chat Completions API.
 * Keeps the API key on the server and avoids CORS when the frontend calls this function.
 *
 * Expects POST body: { systemPrompt?: string, messages: Array<{ role, content }> }
 * Returns: { content: string } or { error: string }
 *
 * Set OPENAI_API_KEY in Netlify (Site settings → Environment variables).
 * For local dev with `netlify dev`, you can use OPENAI_API_KEY or VITE_OPENAI_API_KEY in .env.
 */

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OpenAI API key not configured' })
    }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    }
  }

  const { systemPrompt, messages } = body
  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'messages array required' })
    }
  }

  const openaiMessages = [
    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
    ...messages
  ]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: openaiMessages,
        max_tokens: 280,
        temperature: 0.6
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errText || 'OpenAI request failed' })
      }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Server error' })
    }
  }
}
