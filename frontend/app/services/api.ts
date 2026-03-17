const API_URL = "http://localhost:3000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Erro na requisição";

    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function getCurrentSensors() {
  const response = await fetch(`${API_URL}/engine/sensors`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar sensores atuais");
  }

  return response.json();
}

export async function getRunHistory() {
  const response = await fetch(`${API_URL}/engine/runs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar histórico de execuções");
  }

  return response.json();
}

export async function getMaps() {
  const response = await fetch(`${API_URL}/ecu/maps`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar mapas");
  }

  return response.json();
}

type RunResponse = {
  id: number;
  mapId: number;
  sensors: {
    rpm: number;
    throttle: number;
    temperature: number;
    map: number;
    lambda: number;
  };
  result: {
    calculation: {
      finalInjectionTime: number;
    };
  };
  createdAt: string;
};

export async function runEngine(mapId: number): Promise<RunResponse> {
  const response = await fetch(`${API_URL}/engine/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mapId }),
  });

  return handleResponse(response);
}

type SensorInput = {
  rpm: number;
  throttle: number;
  temperature: number;
  map: number;
  lambda: number;
};

type SensorResponse = {
  id: number;
  rpm: number;
  throttle: number;
  temperature: number;
  map: number;
  lambda: number;
  createdAt: string;
};

export async function createSensorReading(
  payload: SensorInput
): Promise<SensorResponse> {
  const response = await fetch(`${API_URL}/engine/sensors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<SensorResponse>(response);
}
type CreateMapPayload = {
  name: string;
  type: string;
  rpmBins: number[];
  loadBins: number[];
  fuelGrid: number[][];
};

type MapResponse = {
  id: number;
  name: string;
  type: string;
  rpmBins: number[];
  loadBins: number[];
  fuelGrid: number[][];
  createdAt: string;
  updatedAt: string | null;
};

export async function createMap(
  payload: CreateMapPayload
): Promise<MapResponse> {
  const response = await fetch(`${API_URL}/ecu/maps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<MapResponse>(response);
}