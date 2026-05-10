export const ImprintText = () => {
  const email = 'nils.effinghausen@gmail.com';
  return (
    <div className="prose-flow select-text w-full break-words">
      <h2>Allgemeine Informationspflichten (§&nbsp;5&nbsp;DDG)</h2>
      <h3 className="mt-4 text-base font-semibold">Anbieter</h3>
      <p>
        Nils Effinghausen (Einzelunternehmer)
        <br />
        Betreiber der Plattform „FSMeet“
        <br />
        Lierstra&szlig;e 20
        <br />
        80639 M&uuml;nchen
      </p>

      <h3 className="mt-4 text-base font-semibold">Elektronischer Kontakt</h3>
      <p>E-Mail: {email}</p>
    </div>
  );
};
