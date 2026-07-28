import Link from 'next/link';
import { routeDataProtection, routeTermsOfService } from '@/domain/constants/routes';

const linkClass = 'font-medium text-primary underline underline-offset-4';

/**
 * Jobs feature addendum (German prevails).
 * Not a substitute for legal counsel review.
 */
export function JobsTermsAddendumText() {
  return (
    <div className="prose-flow select-text w-full break-words text-start text-sm">
      <p className="not-prose text-sm text-muted-foreground">Version 1.0 – Stand: 28.07.2026</p>
      <p>
        Hinweis: Diese Zusatzvereinbarung ist in deutscher und englischer Sprache verfügbar. Im Falle von Widersprüchen oder Auslegungsfragen ist die deutsche Version maßgeblich.
      </p>

      <hr className="not-prose my-6 border-border" />

      <h2 className="text-base font-bold">1. Geltungsbereich</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Diese Zusatzvereinbarung gilt ergänzend zu den{' '}
          <Link href={routeTermsOfService} className={linkClass} target="_blank" rel="noopener noreferrer">
            FSMeet-Nutzungsbedingungen
          </Link>{' '}
          und der{' '}
          <Link href={routeDataProtection} className={linkClass} target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung
          </Link>
          .
        </li>
        <li>Sie regelt ausschließlich die Nutzung des optionalen Jobs-Features durch Freestyler (&quot;Artist&quot;).</li>
        <li>Bei Widersprüchen gehen die spezielleren Regelungen dieser Zusatzvereinbarung für das Jobs-Feature vor.</li>
        <li>Mit dem Setzen des Akzeptanz-Hakens erklärst du dich mit dieser Zusatzvereinbarung einverstanden.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">2. Leistungsbeschreibung</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Das Jobs-Feature ermöglicht Artisten, sich für Auftritte, Walk Acts und Workshops listen zu lassen und Buchungsanfragen von Kunden zu erhalten.</li>
        <li>Dein Profil kann in einem öffentlichen Pool erscheinen, auch auf Domains, die von FSMeet betrieben werden (z.&nbsp;B. FreestyleActs).</li>
        <li>FSMeet stellt die technische Infrastruktur zur Listung und zur Übermittlung von Anfragen bereit.</li>
        <li>Es besteht kein Anspruch auf Listung, Sichtbarkeit, Anfragen, Abschlüsse oder einen bestimmten wirtschaftlichen Erfolg.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">3. Rolle von FSMeet als Vermittler</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>FSMeet tritt ausschließlich als Vermittler bzw. Plattformbetreiber auf.</li>
        <li>Verträge über die Durchführung eines Jobs kommen ausschließlich zwischen Artist und Kunde zustande.</li>
        <li>FSMeet ist nicht Vertragspartei dieser Vereinbarungen und schuldet weder die Leistung des Artisten noch die Zahlung des Kunden.</li>
        <li>Angebote, Preise, Reisekosten, Terminabsprachen, Durchführung und Abrechnung liegen in der Verantwortung von Artist und Kunde.</li>
        <li>FSMeet übernimmt keine Prüfung der Bonität, Identität oder Zuverlässigkeit von Kunden oder Artisten über die plattformseitigen Funktionen hinaus.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">4. Voraussetzungen für die Nutzung</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Du benötigst einen FSMeet-Account und musst diese Zusatzvereinbarung akzeptieren.</li>
        <li>Für die Nutzung ist ein kostenpflichtiges Monatsabonnement erforderlich (Zahlungsabwicklung über Stripe).</li>
        <li>Eine öffentliche Listung kann zusätzliche Freigaben durch FSMeet voraussetzen (z.&nbsp;B. Listungsstatus).</li>
        <li>Du bist verpflichtet, wahrheitsgemäße und aktuelle Angaben zu machen und deine Kontaktdaten aktuell zu halten.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">5. Abonnement, Preise und Kündigung</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Das Jobs-Abo ist monatlich kostenpflichtig. Der konkrete Preis und der Abrechnungszeitraum werden dir vor Abschluss des Abos angezeigt.</li>
        <li>Die Zahlung erfolgt über den Zahlungsdienstleister Stripe; es gelten ergänzend die Bedingungen von Stripe.</li>
        <li>Du kannst das Abo jederzeit zum Ende des laufenden Abrechnungsmonats kündigen.</li>
        <li>Nach wirksamer Kündigung endet der Zugang zu den kostenpflichtigen Jobs-Funktionen mit Ablauf des bezahlten Zeitraums.</li>
        <li>Bereits gezahlte Entgelte für den laufenden Abrechnungszeitraum werden vorbehaltlich zwingender gesetzlicher Ansprüche nicht anteilig erstattet.</li>
        <li>
          Sofern du Verbraucher bist, steht dir bei Fernabsatzverträgen grundsätzlich ein gesetzliches Widerrufsrecht zu. Einzelheiten und Ausnahmen (insbesondere bei vorzeitiger Ausführung digitaler
          Inhalte/Dienste mit ausdrücklicher Zustimmung) ergeben sich aus den gesetzlichen Vorschriften sowie ggf. aus den Informationen im Bestellprozess.
        </li>
      </ul>

      <h2 className="mt-4 text-base font-bold">6. Pflichten des Artisten</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Du darfst das Jobs-Feature nur für rechtmäßige Angebote nutzen und keine irreführenden Angaben machen.</li>
        <li>Du bist selbst für steuerliche, sozialversicherungsrechtliche und gewerberechtliche Pflichten verantwortlich.</li>
        <li>Du behandelst Kundendaten vertraulich und nutzt sie nur zur Bearbeitung der jeweiligen Anfrage bzw. Beauftragung.</li>
        <li>FSMeet kann Profile oder Listungen bei Verstößen gegen diese Zusatzvereinbarung oder die Nutzungsbedingungen einschränken oder beenden.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">7. Datenverarbeitung und Datenweitergabe</h2>
      <p>Für die Listung und Vermittlung werden insbesondere folgende Daten verarbeitet bzw. ggf. weitergegeben:</p>
      <p className="mt-2 font-medium">Öffentlich sichtbar (Listung):</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Vor- und Nachname</li>
        <li>Geschlecht</li>
        <li>Nationalität</li>
        <li>Alter</li>
        <li>Wohnort (soweit angegeben/freigegeben)</li>
        <li>Netzwerke (Instagram, TikTok, YouTube)</li>
        <li>Website</li>
        <li>Freestyle seit</li>
        <li>Angebot (Auftritte, Walk Acts, Workshops)</li>
        <li>Erfahrung in Shows</li>
      </ul>
      <p className="mt-2 font-medium">Bei konkreter Anfrage an den Kunden:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Telefonnummer</li>
        <li>E-Mail-Adresse</li>
        <li>T-Shirt-Größe (soweit vorhanden und für die Anfrage relevant)</li>
      </ul>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Rechtsgrundlage und Einzelheiten zur Verarbeitung ergeben sich aus der Datenschutzerklärung.</li>
        <li>
          Du kannst die Einwilligung in diese Zusatzvereinbarung jederzeit widerrufen, indem du den Haken entfernst. Danach wirst du nicht weiter über das Jobs-Feature gelistet; bereits an Kunden
          übermittelte Daten kannst du nicht über FSMeet zurückrufen.
        </li>
        <li>Unabhängig davon bleiben gesetzliche Betroffenenrechte unberührt.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">8. Haftung</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>FSMeet haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit.</li>
        <li>Bei leichter Fahrlässigkeit haftet FSMeet nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren, typischerweise eintretenden Schaden.</li>
        <li>Eine Haftung für entgangenen Gewinn, ausgebliebene Anfragen oder fehlgeschlagene Vermittlungen ist – soweit gesetzlich zulässig – ausgeschlossen.</li>
        <li>Zwingende gesetzliche Haftungsvorschriften bleiben unberührt.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">9. Änderungen dieser Zusatzvereinbarung</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>FSMeet kann diese Zusatzvereinbarung bei Bedarf anpassen, insbesondere bei Änderungen des Jobs-Features oder aus rechtlichen Gründen.</li>
        <li>Über wesentliche Änderungen wirst du in geeigneter Weise informiert.</li>
        <li>Für die weitere Nutzung des Jobs-Features kann eine erneute Zustimmung erforderlich sein.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">10. Anwendbares Recht</h2>
      <p>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften deines Aufenthaltsstaates bleiben unberührt, soweit anwendbar.</p>

      <hr className="not-prose my-8 border-border" />

      <h2 className="text-base font-bold">English version</h2>
      <p className="not-prose text-sm text-muted-foreground">Version 1.0 – As of 28 July 2026</p>
      <p>Note: This addendum is available in German and English. In case of discrepancies, the German version shall prevail.</p>

      <hr className="not-prose my-6 border-border" />

      <h2 className="text-base font-bold">1. Scope</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          This addendum supplements the{' '}
          <Link href={routeTermsOfService} className={linkClass} target="_blank" rel="noopener noreferrer">
            FSMeet Terms of Service
          </Link>{' '}
          and the{' '}
          <Link href={routeDataProtection} className={linkClass} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          .
        </li>
        <li>It applies solely to the optional Jobs feature for freestylers (&quot;Artist&quot;).</li>
        <li>In case of conflict, the more specific rules of this addendum prevail for the Jobs feature.</li>
        <li>By checking the acceptance box, you agree to this addendum.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">2. Service description</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>The Jobs feature lets artists list themselves for shows, walk acts and workshops and receive booking requests from clients.</li>
        <li>Your profile may appear in a public pool, including on domains operated by FSMeet (e.g. FreestyleActs).</li>
        <li>FSMeet provides the technical infrastructure for listing and forwarding requests.</li>
        <li>There is no entitlement to listing, visibility, requests, deals or any particular commercial success.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">3. FSMeet as intermediary</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>FSMeet acts solely as an intermediary / platform operator.</li>
        <li>Contracts for performing a job are concluded exclusively between artist and client.</li>
        <li>FSMeet is not a party to those agreements and is not obliged to perform the artist&apos;s services or the client&apos;s payment.</li>
        <li>Offers, pricing, travel costs, scheduling, performance and settlement are the responsibility of artist and client.</li>
        <li>FSMeet does not verify creditworthiness, identity or reliability of clients or artists beyond platform features.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">4. Requirements</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>You need an FSMeet account and must accept this addendum.</li>
        <li>A paid monthly subscription is required (payments processed via Stripe).</li>
        <li>Public listing may require additional approval by FSMeet (e.g. listing status).</li>
        <li>You must provide truthful, up-to-date information and keep your contact details current.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">5. Subscription, pricing and cancellation</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>The Jobs subscription is charged monthly. The applicable price and billing period are shown before you subscribe.</li>
        <li>Payments are processed by Stripe; Stripe&apos;s terms apply in addition.</li>
        <li>You may cancel at any time effective at the end of the current billing month.</li>
        <li>After cancellation takes effect, access to paid Jobs features ends when the paid period expires.</li>
        <li>Fees already paid for the current billing period are non-refundable except where mandatory law requires otherwise.</li>
        <li>
          If you are a consumer, distance contracts may include a statutory right of withdrawal. Details and exceptions (especially where digital services begin early with express consent) follow
          applicable law and any information provided at checkout.
        </li>
      </ul>

      <h2 className="mt-4 text-base font-bold">6. Artist obligations</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>You may use the Jobs feature only for lawful offers and must not provide misleading information.</li>
        <li>You are solely responsible for tax, social security and trade-law obligations.</li>
        <li>You must treat client data confidentially and use it only to handle the respective request or booking.</li>
        <li>FSMeet may restrict or terminate profiles or listings for breaches of this addendum or the Terms of Service.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">7. Data processing and sharing</h2>
      <p>For listing and introductions, the following data in particular may be processed and, where applicable, shared:</p>
      <p className="mt-2 font-medium">Publicly visible (listing):</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>First and last name</li>
        <li>Gender</li>
        <li>Nationality</li>
        <li>Age</li>
        <li>City of residence (if provided/enabled)</li>
        <li>Socials (Instagram, TikTok, YouTube)</li>
        <li>Website</li>
        <li>Freestyle since</li>
        <li>Offers (shows, walk acts, workshops)</li>
        <li>Show experience</li>
      </ul>
      <p className="mt-2 font-medium">Shared with the client upon a concrete request:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Phone number</li>
        <li>Email address</li>
        <li>T-shirt size (if available and relevant)</li>
      </ul>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Legal bases and further details are set out in the Privacy Policy.</li>
        <li>
          You may withdraw consent to this addendum at any time by unchecking acceptance. You will then no longer be listed via the Jobs feature; data already shared with clients cannot be recalled
          through FSMeet.
        </li>
        <li>Statutory data-subject rights remain unaffected.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">8. Liability</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>FSMeet is fully liable for intent and gross negligence and for injury to life, body or health.</li>
        <li>In cases of slight negligence, FSMeet is liable only for breach of material contractual duties, limited to foreseeable, typical damage.</li>
        <li>Liability for lost profits, missing requests or failed introductions is excluded to the extent permitted by law.</li>
        <li>Mandatory statutory liability rules remain unaffected.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">9. Changes</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>FSMeet may update this addendum when needed, especially if the Jobs feature changes or for legal reasons.</li>
        <li>You will be informed of material changes in an appropriate manner.</li>
        <li>Continued use of the Jobs feature may require renewed acceptance.</li>
      </ul>

      <h2 className="mt-4 text-base font-bold">10. Governing law</h2>
      <p>
        The laws of the Federal Republic of Germany apply, excluding the UN Convention on Contracts for the International Sale of Goods. Mandatory consumer protection rules of your country of
        residence remain unaffected where applicable.
      </p>
    </div>
  );
}
