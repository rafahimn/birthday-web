import tls from 'node:tls';
import net from 'node:net';

type MailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
};

type SmtpConnection = tls.TLSSocket | net.Socket;

const CRLF = '\r\n';

function env(name: string, fallback = '') {
  return process.env[name] || fallback;
}

async function openConnection(): Promise<SmtpConnection> {
  const host = env('SMTP_HOST', 'smtp.gmail.com');
  const port = Number(env('SMTP_PORT', '465'));
  const secure = env('SMTP_SECURE', 'true') === 'true';

  return new Promise((resolve, reject) => {
    const socket = secure
      ? tls.connect({host, port, servername: host, minVersion: 'TLSv1.2'})
      : net.connect({host, port});
    const onError = (error: Error) => { socket.destroy(); reject(error); };
    socket.once('error', onError);
    socket.once('connect', () => {
      socket.removeListener('error', onError);
      resolve(socket);
    });
    socket.setTimeout(20000, () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out'));
    });
  });
}

function readReply(socket: SmtpConnection): Promise<{code:number; text:string}> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const onData = (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const lines = buffer.split(CRLF);
      buffer = lines.pop() || '';
      for (const line of lines) {
        const match = line.match(/^(\d{3})([ -])(.*)$/);
        if (!match) continue;
        if (match[2] === ' ') {
          cleanup();
          resolve({code: Number(match[1]), text: match[3]});
          return;
        }
      }
    };
    const onError = (error: Error) => { cleanup(); reject(error); };
    const cleanup = () => {
      socket.off('data', onData);
      socket.off('error', onError);
    };
    socket.on('data', onData);
    socket.once('error', onError);
  });
}

async function command(socket: SmtpConnection, value: string, accepted: number[] = [250]) {
  socket.write(value + CRLF);
  const reply = await readReply(socket);
  if (!accepted.includes(reply.code)) {
    throw new Error(`SMTP ${reply.code}: ${reply.text}`);
  }
  return reply;
}

function encodeHeader(value: string) {
  return value.replace(/[\r\n]/g, ' ').trim();
}

function buildMessage(options: MailOptions, from: string) {
  const to = Array.isArray(options.to) ? options.to : [options.to];
  const boundary = `bb_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const text = options.text.replace(/\r?\n/g, CRLF);
  const html = (options.html || `<pre>${escapeHtml(options.text)}</pre>`).replace(/\r?\n/g, CRLF);
  const headers = [
    `From: ${encodeHeader(from)}`,
    `To: ${to.map(encodeHeader).join(', ')}`,
    `Subject: ${encodeHeader(options.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].join(CRLF);
  return `${headers}${CRLF}${CRLF}` +
    `--${boundary}${CRLF}Content-Type: text/plain; charset=UTF-8${CRLF}${CRLF}${text}${CRLF}` +
    `--${boundary}${CRLF}Content-Type: text/html; charset=UTF-8${CRLF}${CRLF}${html}${CRLF}` +
    `--${boundary}--${CRLF}`;
}

export async function sendEmail(options: MailOptions) {
  const user = env('SMTP_USER');
  const pass = env('SMTP_APP_PASSWORD');
  if (!user || !pass) throw new Error('SMTP_USER and SMTP_APP_PASSWORD are required');

  const recipients = Array.isArray(options.to) ? options.to : [options.to];
  if (!recipients.length) throw new Error('At least one email recipient is required');
  if (recipients.some((x) => !x || /[\r\n]/.test(x))) throw new Error('Invalid email recipient');

  const from = env('EMAIL_FROM', `Birthday Builder <${user}>`);
  const socket = await openConnection();
  try {
    await readReply(socket);
    await command(socket, 'EHLO birthday-builder.local');
    await command(socket, 'AUTH LOGIN', [334]);
    await command(socket, Buffer.from(user, 'utf8').toString('base64'), [334]);
    await command(socket, Buffer.from(pass, 'utf8').toString('base64'), [235]);
    await command(socket, `MAIL FROM:<${user}>`);
    for (const recipient of recipients) await command(socket, `RCPT TO:<${recipient}>`, [250, 251]);
    await command(socket, 'DATA', [354]);
    const message = buildMessage(options, from)
      .replace(/^\./gm, '..');
    socket.write(message + '.' + CRLF);
    const finalReply = await readReply(socket);
    if (finalReply.code !== 250) throw new Error(`SMTP ${finalReply.code}: ${finalReply.text}`);
    await command(socket, 'QUIT', [221, 250]);
  } finally {
    socket.end();
  }
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  const displayName = name?.trim() || 'there';
  return sendEmail({
    to,
    subject: 'Welcome to Birthday Builder 🎂',
    text: `Hi ${displayName},\n\nWelcome to Birthday Builder. Your account has been created successfully.\n\nCreate your first birthday website from your dashboard.`,
    html: `<p>Hi ${escapeHtml(displayName)},</p><p>Welcome to <strong>Birthday Builder</strong>. Your account has been created successfully.</p><p>You can now create your first birthday website from your dashboard.</p>`,
  });
}

export async function sendPasswordResetNotice(to: string) {
  return sendEmail({
    to,
    subject: 'Birthday Builder password reset request',
    text: 'We received a password reset request for your Birthday Builder account. If you made this request, continue with the password reset flow in the application. If you did not request it, you can safely ignore this email.',
    html: '<p>We received a password reset request for your Birthday Builder account.</p><p>If you made this request, continue with the password reset flow in the application. If you did not request it, you can safely ignore this email.</p>',
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[char] || char);
}
