import React, { useState } from 'react';

type datosPredioType = {
  enf: string;
  nombrePredio: string;
  tipoFruta: 'Naranja' | 'Limon' | '';
};

type cantidadType = {
  descarteGeneral: number;
  pareja: number;
  balin: number;
  descompuesta: number;
  piel: number;
  hojas: number;
  numeroCanastillas: number; // Nuevo campo para el número de canastillas
};

type loteType = {
  status: number;
  data: {
    enf: string;
    tipoFruta: 'Limon' | 'Naranja';
    nombreLote: string;
    kilosVaciados: number; // Agregado para evitar errores de compilación
  };
};

const serverUrl = 'http://localhost:3005/';

export default function Form() {
  const [lote, setLote] = useState<loteType | null>(null);
  const [cantidad, setCantidad] = useState<cantidadType>({
    descarteGeneral: 0,
    pareja: 0,
    balin: 0,
    descompuesta: 0,
    piel: 0,
    hojas: 0,
    numeroCanastillas: 0, // Inicializado en 0, puedes ajustarlo según tus necesidades
  });
  const [datosPredio, setDatosPredio] = useState<datosPredioType>({
    enf: '',
    nombrePredio: '',
    tipoFruta: '',
  });
  const [numeroCanastillasDescarte, setNumeroCanastillasDescarte] = useState('');
  const [numeroCanastillasPareja, setNumeroCanastillasPareja] = useState('');
  const [numeroCanastillasBalin, setNumeroCanastillasBalin] = useState('');
  const [numeroCanastillasDescompuesta, setNumeroCanastillasDescompuesta] = useState('');
  const [numeroCanastillasPiel, setNumeroCanastillasPiel] = useState('');
  const [numeroCanastillasHojas, setNumeroCanastillasHojas] = useState('');

  const obtenerLote = async (): Promise<void> => {
    try {
      // Utiliza tu función ingresoFruta en lugar de fetch
      const response = await window.api.ingresoFruta({
        action: 'obtenerLoteVaciando',
      });

      setLote(response);
    } catch (error) {
      console.error('Error al obtener lote:', error);
    }
  };

  const guardarDatos = async (): Promise<void> => {
    try {
      // Utiliza tu función ingresoFruta en lugar de fetch
      const response = await window.api.ingresoFruta({
        action: 'guardarDatos',
        data: {
          datosPredio,
          cantidad,
        },
      });

      if (response.status === 200) {
        console.log('Datos guardados con éxito');
      } else {
        console.error('Error al guardar datos:', response);
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  return (
    <div className="p-4">
      {lote ? (
        <div>
          <h2 className="text-xl font-bold">Predio: {lote.data.nombreLote}</h2>
          <p className="mt-2">ENF: {lote.data.enf}</p>
          <p>Tipo de Fruta: {lote.data.tipoFruta}</p>
          <p>Kilos Vaciados: {lote.data.kilosVaciados}</p>

          <h3 className="text-lg font-bold mt-4">Descarte Lavado</h3>
          <div className="mt-2">
          <label className="block">
    Num. de Canastillas:
    <input
      type="number"
      value={numeroCanastillasDescarte}
      onChange={(e) => setNumeroCanastillasDescarte(isNaN(parseFloat(e.target.value)) ? numeroCanastillasDescarte : parseFloat(e.target.value))}
      className="border p-1 mt-1"
    />
  </label>
            <label className="block">
              Descarte General:
              <input
                type="number"
                value={cantidad.descarteGeneral}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setCantidad({
                    ...cantidad,
                    descarteGeneral: isNaN(parseFloat(inputValue)) ? cantidad.descarteGeneral : parseFloat(inputValue),
                  });
                }}
                className="border p-1 mt-1"
              />
            </label>
            <label className="block">
    Num. de Canastillas:
    <input
      type="number"
      value={numeroCanastillasPareja}
      onChange={(e) => setNumeroCanastillasPareja(isNaN(parseFloat(e.target.value)) ? numeroCanastillasPareja : parseFloat(e.target.value))}
      className="border p-1 mt-1"
    />
  </label>
            <label className="block">
              Pareja:
              <input
                type="number"
                value={cantidad.pareja}
                onChange={(e) =>
                  setCantidad({ ...cantidad, pareja: +e.target.value })
                }
                className="border p-1 mt-1"
              />
            </label>
            <label className="block">
    Num. de Canastillas:
    <input
      type="number"
      value={numeroCanastillasBalin}
      onChange={(e) => setNumeroCanastillasBalin(isNaN(parseFloat(e.target.value)) ? numeroCanastillasBalin : parseFloat(e.target.value))}
      className="border p-1 mt-1"
    />
  </label>
            <label className="block">
              Balin:
              <input
                type="number"
                value={cantidad.balin}
                onChange={(e) =>
                  setCantidad({ ...cantidad, balin: +e.target.value })
                }
                className="border p-1 mt-1"
              />
            </label>
            <label className="block">
    Num. de Canastillas:
    <input
      type="number"
      value={numeroCanastillasDescompuesta}
      onChange={(e) => setNumeroCanastillasDescompuesta(isNaN(parseFloat(e.target.value)) ? numeroCanastillasDescompuesta : parseFloat(e.target.value))}
      className="border p-1 mt-1"
    />
  </label>
            <label className="block">
              Descompuesta:
              <input
                type="number"
                value={cantidad.descompuesta}
                onChange={(e) =>
                  setCantidad({ ...cantidad, descompuesta: +e.target.value })
                }
                className="border p-1 mt-1"
              />
            </label>
            <label className="block">
    Num. de Canastillas:
    <input
      type="number"
      value={numeroCanastillasPiel}
      onChange={(e) => setNumeroCanastillasPiel(isNaN(parseFloat(e.target.value)) ? numeroCanastillasPiel : parseFloat(e.target.value))}
      className="border p-1 mt-1"
    />
  </label>
            <label className="block">
              Desprendimiento de piel:
              <input
                type="number"
                value={cantidad.piel}
                onChange={(e) =>
                  setCantidad({ ...cantidad, piel: +e.target.value })
                }
                className="border p-1 mt-1"
              />
            </label>
            <label className="block">
    Num. de Canastillas:
    <input
      type="number"
      value={numeroCanastillasHojas}
      onChange={(e) => setNumeroCanastillasHojas(isNaN(parseFloat(e.target.value)) ? numeroCanastillasHojas : parseFloat(e.target.value))}
      className="border p-1 mt-1"
    />
  </label>
            <label className="block">
              Hojas:
              <input
                type="number"
                value={cantidad.hojas}
                onChange={(e) =>
                  setCantidad({ ...cantidad, hojas: +e.target.value })
                }
                className="border p-1 mt-1"
              />
            </label>
          </div>

          <button
            onClick={guardarDatos}
            className="bg-blue-500 text-white p-2 mt-4 cursor-pointer"
          >
            Guardar
          </button>
        </div>
      ) : (
        <button
          onClick={obtenerLote}
          className="bg-green-500 text-white p-2 cursor-pointer"
        >
          Cargar predio
        </button>
      )}
    </div>
  );
}
