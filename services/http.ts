export type BackendFieldErrors = Record<string, string[]>;

export type BackendErrorPayload = {
  success: false;
  message: string;
  errors?: {
    formErrors?: string[];
    fieldErrors?: BackendFieldErrors;
  };
};

export type BackendSuccessPayload<T> = {
  success: true;
  message: string;
} & T;

export class ApiError extends Error {
  status: number;
  fieldErrors: BackendFieldErrors;
  formErrors: string[];

  constructor(
    message: string,
    status: number,
    options?: { fieldErrors?: BackendFieldErrors; formErrors?: string[] }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options?.fieldErrors ?? {};
    this.formErrors = options?.formErrors ?? [];
  }
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new ApiError(response.statusText || "Request failed.", response.status);
  }

  return (await response.json()) as T;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const payload = await readJsonResponse<
    T | BackendErrorPayload | { success: false; message: string }
  >(response).catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as BackendErrorPayload | null;
    const fallbackMessage = response.statusText || "Request failed.";

    throw new ApiError(
      errorPayload?.message ?? fallbackMessage,
      response.status,
      {
        fieldErrors: errorPayload?.errors?.fieldErrors,
        formErrors: errorPayload?.errors?.formErrors,
      }
    );
  }

  return payload as T;
}
