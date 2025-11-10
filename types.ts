
export interface NormalizedFields {
  booking_id: string;
  party: {
    name: string;
    role: string;
  };
  itinerary: {
    origin: string;
    destination: string;
    dates: string[];
    carrier_or_hotel: string;
    flight_no?: string;
  };
  amounts: {
    charged: number;
    currency: string;
    taxes: number | null;
    fees: number | null;
  };
  timelines: {
    booking_time: string;
    event_time: string;
  };
  platform: string;
  policy_terms: {
    id: string;
    text: string;
  }[];
  attachments_index: string[];
}

export interface Claim {
  statement: string;
  support: {
    source: string;
    id_or_ref: string;
    quote: string;
  }[];
}

export interface ExecutionStep {
  step: number;
  action: string;
  success_criteria: string;
  sla_hours: number;
}

export interface RefundData {
  normalized_fields: NormalizedFields;
  claims: Claim[];
  execution_steps: ExecutionStep[];
  appeal_draft: string;
  requested_fields?: string[];
}

export interface Audit {
  checks: string[];
}

export interface RefundResponse {
  status: 'ok' | 'error';
  reason?: string;
  data: RefundData;
  audit: Audit;
}
