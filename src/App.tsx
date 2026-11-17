import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Cipo } from "./type/types";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [cipok, setCipok] = useState<Cipo[]>([]);

  const [nev, setNev] = useState("");
  const [marka, setMarka] = useState("");
  const [ar, setAr] = useState("");
  const [datum, setDatum] = useState("");
  const [raktaron, setRaktaron] = useState(false);

  useEffect(() => {
    async function fetchCipok() {
      try {
        const response = await fetch("http://localhost:3000/cipok");

        if (!response.ok) {
          throw new Error("Nem sikerült lekérni a cipőket.");
        }

        const data: Cipo[] = await response.json();
        setCipok(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log("Hiba történt: " + err.message);
        }
      }
    }

    fetchCipok();
  }, []);

  async function handleCipoFelvetel(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const ujCipo = {
      nev: nev,
      marka: marka,
      ar: Number(ar),
      datum: datum,
      raktaron: raktaron,
    };

    try {
      const response = await fetch("http://localhost:3000/cipok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ujCipo),
      });

      if (!response.ok) {
        throw new Error("Nem sikerült menteni a cipőt.");
      }

      const data: Cipo = await response.json();

      setCipok([...cipok, data]);

      setNev("");
      setMarka("");
      setAr("");
      setDatum("");
      setRaktaron(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Hiba történt: " + err.message);
      }
    }
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Ikonikus cipők</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Cipőlista</h2>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Név</th>
                  <th>Márka</th>
                  <th>Ár</th>
                  <th>Felvétel dátuma</th>
                  <th>Raktáron</th>
                </tr>
              </thead>

              <tbody>
                {cipok.map((cipo) => (
                  <tr key={cipo.id}>
                    <td>{cipo.nev}</td>
                    <td>{cipo.marka}</td>
                    <td>{cipo.ar} Ft</td>
                    <td>{cipo.datum}</td>
                    <td>{cipo.raktaron ? "Igen" : "Nem"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-3">Új cipő felvétele</h2>

          <form onSubmit={handleCipoFelvetel}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nev" className="form-label">
                  Cipő neve
                </label>
                <input
                  id="nev"
                  className="form-control"
                  type="text"
                  value={nev}
                  onChange={(e) => setNev(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="marka" className="form-label">
                  Márka
                </label>
                <input
                  id="marka"
                  className="form-control"
                  type="text"
                  value={marka}
                  onChange={(e) => setMarka(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="ar" className="form-label">
                  Ár (Ft)
                </label>
                <input
                  id="ar"
                  className="form-control"
                  type="number"
                  min="0"
                  step="1"
                  value={ar}
                  onChange={(e) => setAr(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="datum" className="form-label">
                  Felvétel dátuma
                </label>
                <input
                  id="datum"
                  className="form-control"
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-check mb-3">
              <input
                id="raktaron"
                className="form-check-input"
                type="checkbox"
                checked={raktaron}
                onChange={(e) => setRaktaron(e.target.checked)}
              />
              <label htmlFor="raktaron" className="form-check-label">
                Raktáron van
              </label>
            </div>

            <button className="btn btn-primary" type="submit">
              Cipő felvétele
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
