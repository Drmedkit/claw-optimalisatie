import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactFormSchema, quoteRequestSchema, insertSubmissionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { appendToSheet, ensureHeaders } from "./google-sheets";
import { sendAdminNotification, sendCustomerConfirmation } from "./email";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID_2 || "";
const SPREADSHEET_ID_2 = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";

// Define headers for Quote Requests sheet
const QUOTE_HEADERS = [
  'Timestamp',
  'Naam',
  'Bedrijfsnaam',
  'Email',
  'Telefoon',
  'Postcode',
  'Adres',
  'Type woning',
  'Service',
  'Oppervlakte',
  'Fotografie pakket',
  'Puntentelling',
  'Adviesrapport',
  'Spoed service',
  'Totaalprijs (€)',
];

// Define headers for Contact Submissions sheet
const CONTACT_HEADERS = [
  'Timestamp',
  'Naam',
  'Email',
  'Telefoon',
  'Adres',
  'Bericht',
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      console.log("New contact submission:", contact);
      
      // Export to Google Sheets if configured
      const rowData = [[
        new Date().toISOString(),
        contact.name,
        contact.email,
        contact.phone || '',
        contact.propertyAddress || '',
        contact.message,
      ]];

      // Ensure headers are set in both sheets before appending data
      const headerPromises = [];
      if (SPREADSHEET_ID) {
        headerPromises.push(
          ensureHeaders(SPREADSHEET_ID, 'Contact Submissions', CONTACT_HEADERS)
            .catch((error) => console.error('Failed to set headers in primary sheet:', error))
        );
      }
      if (SPREADSHEET_ID_2) {
        headerPromises.push(
          ensureHeaders(SPREADSHEET_ID_2, 'Contact Submissions', CONTACT_HEADERS)
            .catch((error) => console.error('Failed to set headers in secondary sheet:', error))
        );
      }
      
      // Wait for headers to be set
      if (headerPromises.length > 0) {
        await Promise.allSettled(headerPromises);
      }

      // Now append the data to both sheets
      const sheetsToExport = [];
      if (SPREADSHEET_ID) {
        sheetsToExport.push(
          appendToSheet(SPREADSHEET_ID, 'Contact Submissions!A:F', rowData)
            .then(() => ({ sheet: 'primary', success: true }))
            .catch((error) => ({ sheet: 'primary', success: false, error }))
        );
      }

      if (SPREADSHEET_ID_2) {
        sheetsToExport.push(
          appendToSheet(SPREADSHEET_ID_2, 'Contact Submissions!A:F', rowData)
            .then(() => ({ sheet: 'secondary', success: true }))
            .catch((error) => ({ sheet: 'secondary', success: false, error }))
        );
      }

      if (sheetsToExport.length > 0) {
        const results = await Promise.allSettled(sheetsToExport);
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const res = result.value;
            if (res.success) {
              console.log(`✓ Contact exported to Google Sheet (${res.sheet})`);
            } else {
              console.error(`✗ Failed to export to Google Sheet (${res.sheet}):`, 'error' in res ? res.error : 'Unknown error');
            }
          }
        });
      }
      
      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        id: contact.id,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validationError.toString(),
        });
      }
      
      console.error("Error processing contact form:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process contact form",
      });
    }
  });

  // Quote request endpoint
  app.post("/api/quote", async (req, res) => {
    try {
      const validatedData = quoteRequestSchema.parse(req.body);
      
      // Convert QuoteRequest to InsertSubmission format
      const submissionData = {
        name: validatedData.name,
        companyName: validatedData.companyName,
        email: validatedData.email,
        phone: validatedData.phone,
        propertyPostcode: validatedData.propertyPostcode,
        propertyAddress: validatedData.propertyAddress,
        propertyType: validatedData.calculatorState.propertyType,
        selectedService: validatedData.calculatorState.selectedService,
        propertySize: validatedData.calculatorState.propertySize,
        fotografiePakket: validatedData.calculatorState.fotografiePakket,
        puntentelling: validatedData.calculatorState.puntentelling || false,
        adviesrapport: validatedData.calculatorState.adviesrapport || false,
        spoedService: validatedData.calculatorState.spoedService || false,
        extraNotes: validatedData.extraNotes,
        totalPrice: validatedData.totalPrice,
      };
      
      const submission = await storage.createSubmission(submissionData);
      
      console.log("New quote request:", submission);
      
      // Export to Google Sheets if configured
      const rowData = [[
        new Date().toISOString(),
        submission.name,
        submission.companyName || '',
        submission.email,
        submission.phone || '',
        submission.propertyPostcode || '',
        submission.propertyAddress || '',
        submission.propertyType,
        submission.selectedService,
        submission.propertySize || '',
        submission.fotografiePakket || '',
        submission.puntentelling ? 'Ja' : 'Nee',
        submission.adviesrapport ? 'Ja' : 'Nee',
        submission.spoedService ? 'Ja' : 'Nee',
        submission.totalPrice?.toString() || '',
      ]];

      // Ensure headers are set in both sheets before appending data
      const headerPromises = [];
      if (SPREADSHEET_ID) {
        headerPromises.push(
          ensureHeaders(SPREADSHEET_ID, 'Quote Requests', QUOTE_HEADERS)
            .catch((error) => console.error('Failed to set headers in primary sheet:', error))
        );
      }
      if (SPREADSHEET_ID_2) {
        headerPromises.push(
          ensureHeaders(SPREADSHEET_ID_2, 'Quote Requests', QUOTE_HEADERS)
            .catch((error) => console.error('Failed to set headers in secondary sheet:', error))
        );
      }
      
      // Wait for headers to be set
      if (headerPromises.length > 0) {
        await Promise.allSettled(headerPromises);
      }

      // Now append the data to both sheets
      const sheetsToExport = [];
      if (SPREADSHEET_ID) {
        sheetsToExport.push(
          appendToSheet(SPREADSHEET_ID, 'Quote Requests!A:O', rowData)
            .then(() => ({ sheet: 'primary', success: true }))
            .catch((error) => ({ sheet: 'primary', success: false, error }))
        );
      }

      if (SPREADSHEET_ID_2) {
        sheetsToExport.push(
          appendToSheet(SPREADSHEET_ID_2, 'Quote Requests!A:O', rowData)
            .then(() => ({ sheet: 'secondary', success: true }))
            .catch((error) => ({ sheet: 'secondary', success: false, error }))
        );
      }

      if (sheetsToExport.length > 0) {
        const results = await Promise.allSettled(sheetsToExport);
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const res = result.value;
            if (res.success) {
              console.log(`✓ Quote exported to Google Sheet (${res.sheet})`);
            } else {
              console.error(`✗ Failed to export to Google Sheet (${res.sheet}):`, 'error' in res ? res.error : 'Unknown error');
            }
          }
        });
      }
      
      // Send email notifications (async, don't block response)
      const emailData = {
        name: submission.name,
        companyName: submission.companyName || undefined,
        email: submission.email,
        phone: submission.phone || undefined,
        propertyPostcode: submission.propertyPostcode || undefined,
        propertyAddress: submission.propertyAddress || undefined,
        propertyType: submission.propertyType,
        selectedService: submission.selectedService,
        propertySize: submission.propertySize,
        fotografiePakket: submission.fotografiePakket,
        puntentelling: submission.puntentelling,
        adviesrapport: submission.adviesrapport,
        spoedService: submission.spoedService,
        extraNotes: submission.extraNotes,
        totalPrice: submission.totalPrice,
      };

      Promise.all([
        sendAdminNotification(emailData),
        sendCustomerConfirmation(emailData)
      ]).catch(emailError => {
        console.error("Failed to send email notifications:", emailError);
      });
      
      res.status(201).json({
        success: true,
        message: "Offerte aanvraag succesvol ontvangen",
        id: submission.id,
        totalPrice: submission.totalPrice,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validationError.toString(),
        });
      }
      
      console.error("Error processing quote request:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process quote request",
      });
    }
  });

  // New submission endpoint (for PostgreSQL)
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      console.log("New submission:", submission);
      
      // Send email notifications (async, don't block response)
      const emailData = {
        name: submission.name,
        companyName: submission.companyName || undefined,
        email: submission.email,
        phone: submission.phone || undefined,
        propertyPostcode: submission.propertyPostcode || undefined,
        propertyAddress: submission.propertyAddress || undefined,
        propertyType: submission.propertyType,
        selectedService: submission.selectedService,
        propertySize: submission.propertySize,
        fotografiePakket: submission.fotografiePakket,
        puntentelling: submission.puntentelling,
        adviesrapport: submission.adviesrapport,
        spoedService: submission.spoedService,
        extraNotes: submission.extraNotes,
        totalPrice: submission.totalPrice,
      };

      // Send emails in parallel without blocking the response
      Promise.all([
        sendAdminNotification(emailData),
        sendCustomerConfirmation(emailData)
      ]).catch(emailError => {
        console.error("Failed to send email notifications:", emailError);
      });
      
      res.status(201).json({
        success: true,
        message: "Aanvraag succesvol ontvangen",
        id: submission.id,
        submission,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({
          success: false,
          error: "Validatie mislukt",
          details: validationError.toString(),
        });
      }
      
      console.error("Error processing submission:", error);
      res.status(500).json({
        success: false,
        error: "Fout bij verwerken aanvraag",
      });
    }
  });

  // Get all submissions (admin endpoint)
  app.get("/api/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch submissions",
      });
    }
  });

  // Get all contacts (admin endpoint - for future use)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json({ contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch contacts",
      });
    }
  });

  // BAG API - Get property surface area by address
  app.get("/api/bag/oppervlakte", async (req, res) => {
    try {
      const { postcode, huisnummer, huisletter, toevoeging } = req.query;

      if (!postcode || !huisnummer) {
        return res.status(400).json({
          success: false,
          error: "Postcode en huisnummer zijn verplicht",
        });
      }

      // Remove spaces from postcode and make uppercase
      const cleanPostcode = String(postcode).replace(/\s/g, '').toUpperCase();

      // Build query parameters
      const params = new URLSearchParams({
        postcode: cleanPostcode,
        huisnummer: String(huisnummer),
      });

      if (huisletter) params.append('huisletter', String(huisletter));
      if (toevoeging) params.append('huislettertoevoeging', String(toevoeging));

      // Get API key from environment
      const apiKey = process.env.BAG_API_KEY;
      if (!apiKey) {
        console.error("BAG_API_KEY not configured");
        return res.status(500).json({
          success: false,
          error: "BAG API niet geconfigureerd",
        });
      }

      console.log(`[BAG API] Looking up address: ${cleanPostcode} ${huisnummer}`);

      // Call BAG API to get nummeraanduiding (address identifier) with expand to get street and city names
      const nummeraanduidingUrl = `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/nummeraanduidingen?${params}&expand=true`;
      const nummeraanduidingResponse = await fetch(nummeraanduidingUrl, {
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/hal+json',
        },
      });

      if (!nummeraanduidingResponse.ok) {
        console.error("BAG API nummeraanduiding error:", nummeraanduidingResponse.status);
        const errorBody = await nummeraanduidingResponse.text();
        console.error("Error body:", errorBody);
        return res.status(404).json({
          success: false,
          error: "Adres niet gevonden in BAG",
        });
      }

      const nummeraanduidingData = await nummeraanduidingResponse.json();
      console.log("[BAG API] Nummeraanduiding response:", JSON.stringify(nummeraanduidingData, null, 2));

      if (!nummeraanduidingData._embedded?.nummeraanduidingen?.[0]) {
        console.error("No nummeraanduiding found in response");
        return res.status(404).json({
          success: false,
          error: "Geen adres gevonden",
        });
      }

      const nummeraanduidingItem = nummeraanduidingData._embedded.nummeraanduidingen[0];
      const nummeraanduiding = nummeraanduidingItem.nummeraanduiding;
      const nummeraanduidingId = nummeraanduiding.identificatie;

      // Extract street name and city from expanded data
      const straatnaam = nummeraanduidingItem._embedded?.ligtAanOpenbareRuimte?.openbareRuimte?.naam || '';
      const woonplaats = nummeraanduidingItem._embedded?.ligtInWoonplaats?.woonplaats?.naam || '';

      console.log("[BAG API] Nummeraanduiding ID:", nummeraanduidingId);
      console.log("[BAG API] Straatnaam:", straatnaam);
      console.log("[BAG API] Woonplaats:", woonplaats);

      // Use adresseerbareobjecten endpoint to find the verblijfsobject with this nummeraanduiding
      const adresseerbaarObjectUrl = `https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adresseerbareobjecten?nummeraanduidingIdentificatie=${nummeraanduidingId}`;

      console.log("[BAG API] Adresseerbaar object URL:", adresseerbaarObjectUrl);

      const adresseerbaarObjectResponse = await fetch(adresseerbaarObjectUrl, {
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/hal+json',
          'Accept-Crs': 'epsg:28992', // Rijksdriehoekscoördinaten (standaard NL)
        },
      });

      if (!adresseerbaarObjectResponse.ok) {
        console.error("BAG API adresseerbaar object error:", adresseerbaarObjectResponse.status);
        const errorBody = await adresseerbaarObjectResponse.text();
        console.error("Error body:", errorBody);
        return res.status(404).json({
          success: false,
          error: "Fout bij ophalen adresseerbaar object",
        });
      }

      const adresseerbaarObjectData = await adresseerbaarObjectResponse.json();
      console.log("[BAG API] Adresseerbaar object response:", JSON.stringify(adresseerbaarObjectData, null, 2));

      // Get the verblijfsobject from the response
      const verblijfsobjecten = adresseerbaarObjectData._embedded?.adresseerbareObjecten;

      if (!verblijfsobjecten || verblijfsobjecten.length === 0) {
        console.error("No adresseerbareObjecten found");
        return res.status(404).json({
          success: false,
          error: "Geen verblijfsobject gevonden voor dit adres",
        });
      }

      const verblijfsobject = verblijfsobjecten[0];
      console.log("[BAG API] Verblijfsobject:", JSON.stringify(verblijfsobject, null, 2));

      // Get oppervlakte from verblijfsobject (nested structure)
      const oppervlakte = verblijfsobject.verblijfsobject?.verblijfsobject?.oppervlakte ||
                          verblijfsobject.verblijfsobject?.oppervlakte ||
                          verblijfsobject.oppervlakte;

      if (!oppervlakte) {
        console.error("No oppervlakte found in verblijfsobject");
        return res.status(404).json({
          success: false,
          error: "Oppervlakte niet beschikbaar voor dit adres",
        });
      }

      console.log(`[BAG API] Found oppervlakte: ${oppervlakte}m²`);

      res.json({
        success: true,
        oppervlakte: oppervlakte,
        adres: {
          straatnaam: straatnaam,
          huisnummer: String(huisnummer),
          huisletter: huisletter ? String(huisletter) : undefined,
          toevoeging: toevoeging ? String(toevoeging) : undefined,
          postcode: cleanPostcode,
          woonplaats: woonplaats,
        },
      });
    } catch (error: any) {
      console.error("Error fetching BAG oppervlakte:", error);
      res.status(500).json({
        success: false,
        error: "Fout bij ophalen oppervlakte",
        details: error.message,
      });
    }
  });

  // EP-online energielabel check by address
  app.get("/api/energielabel/check", async (req, res) => {
    const { postcode, huisnummer, huisnummertoevoeging } = req.query;

    if (!postcode || !huisnummer) {
      return res.status(400).json({ success: false, error: "Postcode en huisnummer zijn verplicht." });
    }

    const apiKey = process.env.EP_ONLINE_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ success: false, error: "EP-online API niet geconfigureerd." });
    }

    try {
      const cleanPostcode = String(postcode).replace(/\s/g, "").toUpperCase();
      const params = new URLSearchParams({
        postcode: cleanPostcode,
        huisnummer: String(huisnummer),
      });
      if (huisnummertoevoeging) {
        params.append("huisnummertoevoeging", String(huisnummertoevoeging));
      }

      const url = `https://public.ep-online.nl/api/v5/PandEnergielabel/Adres/?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          Authorization: apiKey,
          Accept: "application/json",
        },
      });

      if (response.status === 404) {
        return res.json({ success: true, found: false });
      }

      if (!response.ok) {
        const text = await response.text();
        console.error("[EP-online] API error:", response.status, text);
        return res.status(500).json({ success: false, error: "Fout bij ophalen energielabel." });
      }

      const data = await response.json();

      // v5 returns an array; take the most recent (first) entry
      const label = Array.isArray(data) ? data[0] : data;

      if (!label) {
        return res.json({ success: true, found: false });
      }

      // Build a readable address line from available fields
      const hnr = label.Huisnummer ? String(label.Huisnummer) : "";
      const toev = label.Huisnummertoevoeging ? ` ${label.Huisnummertoevoeging}` : "";
      const adresregel = hnr ? `${label.Postcode ?? cleanPostcode} ${hnr}${toev}` : null;

      return res.json({
        success: true,
        found: true,
        energieklasse: label.Energieklasse ?? null,
        registratiedatum: label.Registratiedatum ?? null,
        geldigTot: label.Geldig_tot ?? null,
        gebouwtype: label.Gebouwtype ?? null,
        gebouwsubtype: label.Gebouwsubtype ?? null,
        bouwjaar: label.Bouwjaar ?? null,
        oppervlakte: label.Gebruiksoppervlakte_thermische_zone ?? null,
        adres: {
          straatnaam: adresregel,
          postcode: label.Postcode ?? cleanPostcode,
          woonplaats: null,
        },
      });
    } catch (error: any) {
      console.error("[EP-online] Error:", error);
      return res.status(500).json({ success: false, error: "Fout bij ophalen energielabel." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
