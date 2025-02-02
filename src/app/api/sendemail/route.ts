import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY || '';

sgMail.setApiKey(apiKey);

interface EmailRequestBody {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function POST(req: Request) {
  try {

    const body: EmailRequestBody = await req.json();
    const { to, subject, text, html } = body;
    if (!to || !subject || !text || !html) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    const message = {
      to,
      from: 'guilad1233@gmail.com', 
      subject,
      text,
      html,
    };

    await sgMail.send(message);

    return NextResponse.json(
      { success: true, message: 'Correo enviado correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar el correo' },
      { status: 500 }
    );
  }
}