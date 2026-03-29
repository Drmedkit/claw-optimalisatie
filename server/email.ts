import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

interface EmailData {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  propertyPostcode?: string;
  propertyAddress?: string;
  propertyType: string;
  selectedService: string;
  propertySize?: string | null;
  fotografiePakket?: string | null;
  puntentelling?: boolean;
  adviesrapport?: boolean;
  spoedService: boolean;
  extraNotes?: string | null;
  totalPrice?: number | null;
}

export async function sendAdminNotification(data: EmailData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const serviceNames: Record<string, string> = {
      'energielabel': 'Energielabel',
      'fotografie': 'Fotografie',
      'label-fotografie': 'Label + Fotografie',
      'puntentelling': 'Puntentelling (WWS)',
      'adviesrapport': 'Adviesrapport'
    };

    const sizeNames: Record<string, string> = {
      'tot-50': 'Tot 50m²',
      '50-100': '50-100m²',
      '100-150': '100-150m²',
      '150-plus': '150m²+'
    };

    const pakketNames: Record<string, string> = {
      'basis': 'Visuals Basis (€249)',
      'totaal': 'Visuals Totaal (€325)',
      'exclusief': 'Visuals Exclusief (€399)'
    };

    const serviceDetails = [];
    serviceDetails.push(`<strong>Dienst:</strong> ${serviceNames[data.selectedService] || data.selectedService}`);
    serviceDetails.push(`<strong>Woningtype:</strong> ${data.propertyType === 'koop' ? 'Koopwoning' : 'Huurwoning'}`);
    
    if (data.propertySize) {
      serviceDetails.push(`<strong>Oppervlakte:</strong> ${sizeNames[data.propertySize] || data.propertySize}`);
    }
    
    if (data.fotografiePakket) {
      serviceDetails.push(`<strong>Fotografie pakket:</strong> ${pakketNames[data.fotografiePakket] || data.fotografiePakket}`);
    }
    
    if (data.puntentelling) {
      serviceDetails.push(`<strong>Puntentelling:</strong> Ja (+€120)`);
    }
    
    if (data.adviesrapport) {
      serviceDetails.push(`<strong>Adviesrapport:</strong> Ja (+€100)`);
    }
    
    if (data.spoedService) {
      serviceDetails.push(`<strong>Spoed service:</strong> Ja (+€50)`);
    }

    const htmlContent = `
      <h2>Nieuwe aanvraag van ${data.name}</h2>
      
      <h3>Contactgegevens:</h3>
      <ul>
        <li><strong>Naam:</strong> ${data.name}</li>
        ${data.companyName ? `<li><strong>Bedrijfsnaam:</strong> ${data.companyName}</li>` : ''}
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Telefoon:</strong> ${data.phone}</li>` : ''}
        ${data.propertyPostcode ? `<li><strong>Postcode:</strong> ${data.propertyPostcode}</li>` : ''}
        ${data.propertyAddress ? `<li><strong>Adres:</strong> ${data.propertyAddress}</li>` : ''}
      </ul>

      <h3>Aanvraag details:</h3>
      <ul>
        ${serviceDetails.map(detail => `<li>${detail}</li>`).join('\n')}
        ${data.totalPrice ? `<li><strong>Totaalprijs:</strong> €${data.totalPrice}</li>` : ''}
      </ul>

      ${data.extraNotes ? `
        <h3>Extra opmerkingen:</h3>
        <p>${escapeHtml(data.extraNotes)}</p>
      ` : ''}
    `;

    await client.emails.send({
      from: fromEmail,
      to: [fromEmail, 'Info@labelenlens.nl'],
      subject: `Nieuwe aanvraag: ${serviceNames[data.selectedService]} - ${data.name}`,
      html: htmlContent,
    });

    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    throw error;
  }
}

export async function sendCustomerConfirmation(data: EmailData) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const serviceNames: Record<string, string> = {
      'energielabel': 'Energielabel',
      'fotografie': 'Fotografie',
      'label-fotografie': 'Label + Fotografie',
      'puntentelling': 'Puntentelling (WWS)',
      'adviesrapport': 'Adviesrapport'
    };

    const htmlContent = `
      <h2>Bedankt voor uw aanvraag!</h2>
      
      <p>Beste ${data.name},</p>
      
      <p>We hebben uw aanvraag voor <strong>${serviceNames[data.selectedService]}</strong> goed ontvangen.</p>
      
      <p>We nemen zo snel mogelijk contact met u op om de volgende stappen te bespreken en een afspraak in te plannen.</p>
      
      ${data.totalPrice ? `<p><strong>Indicatieve prijs:</strong> €${data.totalPrice}</p>` : ''}
      
      <h3>Uw gegevens:</h3>
      <ul>
        ${data.companyName ? `<li><strong>Bedrijf:</strong> ${data.companyName}</li>` : ''}
        <li><strong>Email:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Telefoon:</strong> ${data.phone}</li>` : ''}
        ${data.propertyPostcode ? `<li><strong>Postcode:</strong> ${data.propertyPostcode}</li>` : ''}
        ${data.propertyAddress ? `<li><strong>Adres:</strong> ${data.propertyAddress}</li>` : ''}
      </ul>
      
      <p>Heeft u nog vragen? Neem gerust contact met ons op.</p>
      
      <p>Met vriendelijke groet,<br>
      <strong>Label & Lens</strong><br>
      Amsterdam Energielabels</p>
    `;

    await client.emails.send({
      from: fromEmail,
      to: data.email,
      subject: `Bevestiging aanvraag ${serviceNames[data.selectedService]} - Label & Lens`,
      html: htmlContent,
    });

    console.log('Customer confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    throw error;
  }
}
